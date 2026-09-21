"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import {
  Cross,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);

    const formData = new FormData();
    formData.set("email", email);

    startTransition(async () => {
      const result = await requestPasswordResetAction(null, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccessMessage(
          result.message ||
            "If an active staff account is associated with this email, a password reset link has been dispatched."
        );
        if (result.devResetUrl) {
          setDevResetUrl(result.devResetUrl);
        }
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
          Reset Staff Password
        </h1>
        <p className="text-small text-text-muted mt-1">
          Enter your registered hospital staff email to receive a password reset link.
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

          {/* Success Banner */}
          {successMessage ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-teal-50 border border-teal-200 p-4 flex items-start gap-3 text-xs text-teal-900">
                <CheckCircle2 className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-teal-900">Reset Request Dispatched</p>
                  <p className="text-teal-800 leading-relaxed">{successMessage}</p>
                </div>
              </div>

              {/* Dev/Local Simulation Reset Link Helper */}
              {devResetUrl && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <KeyRound className="h-4 w-4 text-amber-700" />
                    <span>Dev Environment Shortcut</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Because email dispatch is currently stubbed in local development, you can use this simulated token link directly:
                  </p>
                  <Button asChild variant="primary" size="sm" className="w-full text-xs mt-1">
                    <Link href={devResetUrl} className="flex items-center justify-center gap-1.5">
                      Open Reset Password Page
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full text-xs mt-2"
                onClick={() => {
                  setSuccessMessage(null);
                  setDevResetUrl(null);
                  setEmail("");
                }}
              >
                Request Another Reset Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-xs font-semibold mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Generating Reset Link...
                  </>
                ) : (
                  <>
                    Send Password Reset Link
                    <ArrowRight className="h-4 w-4 ml-1.5" />
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
