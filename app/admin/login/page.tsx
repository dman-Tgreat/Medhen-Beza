"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminRole } from "@/components/admin/role-context";
import { UserRoleType, MOCK_USERS } from "@/lib/admin/types";
import {
  Cross,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Stethoscope,
  Briefcase,
  Edit3,
  Sliders,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminRole();
  const [email, setEmail] = useState("director@medhenbeza.com");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRoleType>("HOSPITAL_DIRECTOR");
  const [loading, setLoading] = useState(false);

  const handleRoleQuickSelect = (role: UserRoleType) => {
    setSelectedRole(role);
    setEmail(MOCK_USERS[role].email);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      router.push("/admin");
    }, 400);
  };

  const quickRoles: {
    role: UserRoleType;
    name: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[] = [
    {
      role: "HOSPITAL_DIRECTOR",
      name: "Dr. Samuel Bekele",
      title: "Hospital Director (Full Authority)",
      icon: Shield,
      accent: "bg-primary text-white",
    },
    {
      role: "MEDICAL_DIRECTOR",
      name: "Dr. Bethlehem Tadesse",
      title: "Medical Director (Clinical Content)",
      icon: Stethoscope,
      accent: "bg-secondary text-white",
    },
    {
      role: "HR_STAFF",
      name: "Hanna Worku",
      title: "HR Staff (Careers & Recruitment)",
      icon: Briefcase,
      accent: "bg-indigo-600 text-white",
    },
    {
      role: "CONTENT_STAFF",
      name: "Abel Girma",
      title: "Content Staff (News, Gallery, Pages)",
      icon: Edit3,
      accent: "bg-amber-600 text-white",
    },
    {
      role: "SYSTEM_ADMIN",
      name: "Dawit Abebe",
      title: "System Administrator (IT & Security)",
      icon: Sliders,
      accent: "bg-slate-700 text-white",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Hospital Brand Badge */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-cta">
            <Cross className="h-8 w-8 rotate-45" />
          </div>
        </div>

        <h1 className="mt-4 text-h3 font-bold tracking-tight text-text">
          Medhen Beza Hospital
        </h1>
        <p className="text-small text-text-muted mt-1">
          Hospital Content Management & Administrative Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 shadow-none border border-border sm:rounded-xl sm:px-10 space-y-6">
          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@medhenbeza.com"
                  className="pl-9 text-xs h-10 bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text">
                  Password
                </label>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter staff password"
                  className="pl-9 text-xs h-10 bg-background"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 text-xs font-semibold shadow-cta mt-2"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to CMS"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Quick Role Tester Selector */}
          <div className="relative border-t border-border pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-light">
                Quick Role Tester (Simulation)
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-3">
              Click any staff profile below to test with their exact role permissions:
            </p>

            <div className="space-y-2">
              {quickRoles.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleQuickSelect(item.role)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light/50 ring-1 ring-primary"
                        : "border-border bg-background hover:bg-surface hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 ${item.accent}`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-text truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-text-muted truncate">
                          {item.title}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
