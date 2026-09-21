"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const recentSubmissions = new Map<string, number[]>();
const MAX_SUBMISSIONS_PER_HOUR = 5;

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function submitContactMessageAction(formData: FormData) {
  if (clean(formData.get("website"), 120)) return { success: true };

  const name = clean(formData.get("fullName"), 120);
  const email = clean(formData.get("email"), 160).toLowerCase();
  const phone = clean(formData.get("phone"), 40);
  const subject = clean(formData.get("subject"), 180);
  const message = clean(formData.get("message"), 5000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || subject.length < 3 || message.length < 10) {
    return { error: "Please provide a valid name, email, subject, and message." };
  }

  const requestHeaders = await headers();
  const ip = (requestHeaders.get("x-forwarded-for") || requestHeaders.get("x-real-ip") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= MAX_SUBMISSIONS_PER_HOUR) return { error: "Too many inquiries from this connection. Please try again later." };
  recentSubmissions.set(ip, [...recent, now]);

  try {
    const messageRecord = await db.$transaction(async (tx) => {
      const created = await tx.contactMessage.create({ data: { name, email, phone: phone || null, subject, message } });
      const directors = await tx.user.findMany({
        where: { isActive: true, userRoles: { some: { role: { code: "HOSPITAL_DIRECTOR" } } } },
        select: { id: true },
      });
      if (directors.length) {
        await tx.notification.createMany({
          data: directors.map((director) => ({
            recipientId: director.id,
            type: "INQUIRY",
            title: "New contact inquiry",
            message: `${name} sent a new inquiry: ${subject}`,
            contentType: "ContactMessage",
            contentId: created.id,
          })),
        });
      }
      return created;
    });
    revalidatePath("/admin/messages");
    return { success: true, data: { id: messageRecord.id } };
  } catch {
    return { error: "We could not save your inquiry. Please try again or call the hospital directly." };
  }
}
