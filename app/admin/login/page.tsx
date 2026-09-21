"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { UserRoleType } from "@/lib/admin/types";
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
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_TEST_ACCOUNTS: {
  role: UserRoleType;
  email: string;
  name: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    role: "HOSPITAL_DIRECTOR",
    email: "director@medhenbeza.com",
    name: "Dr. Hospital Director",
    title: "Hospital Director (Full Authority)",
    icon: Shield,
    accent: "bg-primary text-white",
  },
  {
    role: "MEDICAL_DIRECTOR",
    email: "medical@medhenbeza.com",
    name: "Dr. Medical Director",
    title: "Medical Director (Clinical Content)",
    icon: Stethoscope,
    accent: "bg-secondary text-white",
  },
  {
    role: "HR_STAFF",
    email: "hr@medhenbeza.com",
    name: "Abebech HR Manager",
    title: "HR Staff (Careers & Recruitment)",
    icon: Briefcase,
    accent: "bg-indigo-600 text-white",
  },
  {
    role: "CONTENT_STAFF",
    email: "content@medhenbeza.com",
    name: "Yared Content Editor",
    title: "Content Staff (News, Gallery, Pages)",
    icon: Edit3,
    accent: "bg-amber-600 text-white",
  },
  {
    role: "SYSTEM_ADMIN",
    email: "admin@medhenbeza.com",
    name: "Dagmawi System Administrator",
    title: "System Administrator (IT & Security)",
    icon: Sliders,
    accent: "bg-slate-700 text-white",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("director@medhenbeza.com");
  const [password, setPassword] = useState("Admin@Medhen2026!");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleQuickFill = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword("Admin@Medhen2026!");
    setError(null);
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  };

  const isDevMode =
    process.env.NEXT_PUBLIC_ENABLE_ROLE_SIMULATION === "true" ||
    process.env.NODE_ENV !== "production";

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
          {/* Error Banner */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text">
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
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
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 text-xs font-semibold mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to CMS
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Dev Quick-Fill Credentials Helper */}
          {isDevMode && (
            <div className="relative border-t border-border pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  Dev Quick-Fill Accounts
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  Seeded Credentials
                </span>
              </div>
              <p className="text-[11px] text-text-muted mb-3">
                Click any staff account to autofill credentials for instant authentication testing:
              </p>

              <div className="space-y-1.5">
                {QUICK_TEST_ACCOUNTS.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = email === item.email;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleQuickFill(item.email)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary-light/50 ring-1 ring-primary"
                          : "border-border bg-background hover:bg-surface hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded shrink-0 ${item.accent}`}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-text truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-text-muted truncate">
                            {item.email}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium text-text-light shrink-0 ml-2">
                        Autofill
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
