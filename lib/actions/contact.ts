"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validation/schemas";
import { normalizeEthiopianPhone } from "@/lib/validation/phone";

const recentSubmissions = new Map<string, number[]>();
const MAX_SUBMISSIONS_PER_HOUR = 5;

export interface ContactActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  data?: { id: string };
}

export async function submitContactMessageAction(
  formData: FormData
): Promise<ContactActionResult> {
  const rawData = {
    fullName: formData.get("fullName")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    department: formData.get("department")?.toString() || "General Inquiries",
    subject: formData.get("subject")?.toString() || "",
    message: formData.get("message")?.toString() || "",
    website: formData.get("website")?.toString() || "",
  };

  // Bot honeypot check: silently accept without saving
  if (rawData.website && rawData.website.trim().length > 0) {
    return { success: true };
  }

  // Validate using Zod schema
  const validationResult = contactMessageSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validationResult.error.issues) {
      const fieldName = issue.path[0]?.toString() || "form";
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    }
    const firstErrorMessage =
      validationResult.error.issues[0]?.message ||
      "Please fill in all required fields correctly.";
    return { error: firstErrorMessage, fieldErrors };
  }

  const { fullName, email, phone, subject, message } = validationResult.data;

  // Rate Limiting by Client IP
  const requestHeaders = await headers();
  const ip = (
    requestHeaders.get("x-forwarded-for") ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  )
    .split(",")[0]
    .trim();
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) || []).filter(
    (time) => now - time < 60 * 60 * 1000
  );

  if (recent.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return {
      error:
        "Too many inquiries received from this connection. Please try again later or call the hospital switchboard directly.",
    };
  }
  recentSubmissions.set(ip, [...recent, now]);

  // Normalize phone number to standard Ethiopian format
  const normalizedPhone = phone ? normalizeEthiopianPhone(phone, false) : null;

  try {
    const messageRecord = await db.$transaction(async (tx) => {
      const created = await tx.contactMessage.create({
        data: {
          name: fullName,
          email,
          phone: normalizedPhone,
          subject,
          message,
        },
      });

      const directors = await tx.user.findMany({
        where: {
          isActive: true,
          userRoles: {
            some: {
              role: {
                code: { in: ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"] },
              },
            },
          },
        },
        select: { id: true },
      });

      if (directors.length) {
        await tx.notification.createMany({
          data: directors.map((director) => ({
            recipientId: director.id,
            type: "INQUIRY",
            title: "New patient inquiry",
            message: `${fullName} submitted inquiry: "${subject}"`,
            contentType: "ContactMessage",
            contentId: created.id,
          })),
        });
      }

      return created;
    });

    revalidatePath("/admin/messages");
    return { success: true, data: { id: messageRecord.id } };
  } catch (dbError) {
    console.error("[SUBMIT CONTACT ERROR]", dbError);
    return {
      error:
        "We could not save your inquiry due to a temporary service issue. Please try again or call the hospital directly.",
    };
  }
}
