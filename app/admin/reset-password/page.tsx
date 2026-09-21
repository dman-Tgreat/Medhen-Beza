"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth";
import {
  Cross,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing password reset token. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.set("token", token);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const result = await resetPasswordAction(null, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      }
    });
  };

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
          Set New Staff Password
        </h1>
        <p className="text-small text-text-muted mt-1">
          Create a secure password for your administrative CMS account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 shadow-none border border-border sm:rounded-xl sm:px-10 space-y-6">
          {!token && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900">Missing Token</p>
                <p className="text-amber-800">
                  No valid reset token was detected in your link. Please use the exact link sent to your email or request a new one.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-teal-50 border border-teal-200 p-4 flex items-start gap-3 text-xs text-teal-900">
                <CheckCircle2 className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-teal-900">Password Updated Successfully</p>
                  <p className="text-teal-800">
                    Your password has been changed. Redirecting to staff login...
                  </p>
                </div>
              </div>

              <Button asChild variant="primary" className="w-full text-xs">
                <Link href="/admin/login">
                  Sign In Now
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="pl-9 text-xs h-10 bg-background"
                    disabled={isPending || !token}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat new password"
                    className="pl-9 text-xs h-10 bg-background"
                    disabled={isPending || !token}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-xs font-semibold mt-2"
                disabled={isPending || !token}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-1.5" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-border text-center">
            <Link
              href="/admin/login"
              className="text-xs text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Staff Login
            </Link>
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
