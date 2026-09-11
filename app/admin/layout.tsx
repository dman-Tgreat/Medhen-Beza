"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminRoleProvider } from "@/components/admin/role-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, render full screen without admin chrome
  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminTopbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoleProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminRoleProvider>
  );
}
