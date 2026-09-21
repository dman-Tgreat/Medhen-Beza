"use server";

import { ContactMessageStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: ContactMessageStatus;
};

export async function getContactMessagesAction(): Promise<{ success?: boolean; data?: AdminContactMessage[]; error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized." };
  if (!session.roles.some((role) => ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"].includes(role))) return { error: "You are not allowed to view inquiries." };
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return {
    success: true,
    data: messages.map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone || "—",
      subject: message.subject,
      message: message.message,
      date: message.createdAt.toISOString(),
      status: message.status,
    })),
  };
}

export async function updateContactMessageStatusAction(id: string, status: ContactMessageStatus) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized." };
  if (!session.roles.some((role) => ["HOSPITAL_DIRECTOR", "CONTENT_STAFF"].includes(role))) return { error: "You are not allowed to update inquiries." };
  if (status === ContactMessageStatus.UNREAD) return { error: "Unsupported inquiry status." };
  await db.contactMessage.update({ where: { id }, data: { status, repliedAt: status === ContactMessageStatus.REPLIED ? new Date() : undefined } });
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteContactMessageAction(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized." };
  if (!session.roles.includes("HOSPITAL_DIRECTOR")) return { error: "Only the Hospital Director can delete inquiries." };
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  return { success: true };
}
