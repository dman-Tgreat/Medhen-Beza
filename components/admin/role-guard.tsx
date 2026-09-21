"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAdminRole } from "./role-context";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserRoleType } from "@/lib/admin/types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRoleType[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const pathname = usePathname();
  const { currentRole, setRole, canSimulate, canAccessRoute } = useAdminRole();

  const isAllowed = allowedRoles
    ? allowedRoles.includes(currentRole)
    : canAccessRoute(pathname);

  if (!isAllowed) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12">
        <div className="rounded-lg border border-border bg-surface p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
              Access Restricted by Role
            </Badge>
            <h2 className="text-h3 font-bold text-text">Unauthorized Module Access</h2>
            <p className="text-small text-text-muted max-w-lg mx-auto leading-relaxed">
              Your active role (<strong>{currentRole}</strong>) does not have permission
              to access this section per hospital governance and access policies.
            </p>
          </div>

          <div className="bg-background rounded-md p-4 border border-border text-xs text-text-light text-left space-y-2">
            <p className="font-semibold text-text">Access Rules for This Section:</p>
            {allowedRoles ? (
              <p>Authorized roles: {allowedRoles.join(", ")}</p>
            ) : (
              <p>
                Technical administration (System Admin) and clinical/content approval
                are strictly separated to ensure hospital compliance.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Link>
            </Button>

            {canSimulate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRole("HOSPITAL_DIRECTOR")}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Simulate Hospital Director
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
