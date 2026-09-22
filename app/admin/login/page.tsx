import { Suspense } from "react";
import { getPublicSiteSettings } from "@/lib/queries/public";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export default async function AdminLoginPage() {
  const settings = await getPublicSiteSettings();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLoginClient hospitalName={settings.hospitalName} />
    </Suspense>
  );
}
