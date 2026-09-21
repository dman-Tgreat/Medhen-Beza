import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  getAdminPendingContent,
  getAdminApprovedContent,
  getAdminRejectedContent,
  getAdminPublishedContent,
} from "@/lib/queries/admin";
import { ApprovalsClient } from "@/components/admin/approvals-client";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [pending, approved, rejected, published] = await Promise.all([
    getAdminPendingContent(session),
    getAdminApprovedContent(session),
    getAdminRejectedContent(session),
    getAdminPublishedContent(session),
  ]);

  return (
    <ApprovalsClient
      pending={pending}
      approved={approved}
      rejected={rejected}
      published={published}
      currentUserId={session.id}
    />
  );
}
