"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

const DEFAULT_SIDEBAR_WIDTH = 260;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 460;

const AUTH_PAGES = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  contentType: string;
  contentId: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminLayoutShell({
  children,
  initialNotifications = [],
  hospitalName,
}: {
  children: React.ReactNode;
  initialNotifications?: NotificationItem[];
  hospitalName?: string;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Restore persisted width & track viewport
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("medhen_admin_sidebar_width");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
          setSidebarWidth(parsed);
        }
      }
    } catch {
      // Ignore localStorage restrictions
    }

    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mouse drag handler for sidebar resizing
  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(moveEvent.clientX, MIN_SIDEBAR_WIDTH),
        MAX_SIDEBAR_WIDTH
      );
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      const finalWidth = Math.min(
        Math.max(upEvent.clientX, MIN_SIDEBAR_WIDTH),
        MAX_SIDEBAR_WIDTH
      );
      setSidebarWidth(finalWidth);
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      try {
        localStorage.setItem("medhen_admin_sidebar_width", String(finalWidth));
      } catch {
        // Ignore
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResetWidth = () => {
    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
    try {
      localStorage.setItem("medhen_admin_sidebar_width", String(DEFAULT_SIDEBAR_WIDTH));
    } catch {
      // Ignore
    }
  };

  // If on auth pages (login, forgot-password, reset-password), render full screen without admin chrome
  const isAuthPage = AUTH_PAGES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isAuthPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation (Resizable) */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        sidebarWidth={sidebarWidth}
        isResizing={isResizing}
        onStartResize={handleStartResize}
        onResetWidth={handleResetWidth}
        hospitalName={hospitalName}
      />

      {/* Main Content Area */}
      <div
        className="flex flex-col min-h-screen w-full"
        style={{
          paddingLeft: isDesktop ? (isCollapsed ? 64 : sidebarWidth) : 0,
          transition: isResizing ? "none" : "padding 0.2s ease",
        }}
      >
        <AdminTopbar
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          initialNotifications={initialNotifications}
        />

        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
