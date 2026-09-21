"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import crypto from "crypto";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
  message?: string;
  redirectUrl?: string;
  devResetUrl?: string;
}

/**
 * Staff Login Server Action
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "Invalid staff email or password." };
    }

    if (!user.isActive) {
      return {
        error: "This account has been deactivated. Please contact the Hospital Director or System Administrator.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid staff email or password." };
    }

    const roles = user.userRoles.map((ur) => ur.role.code);
    const primaryRole = roles[0] || "CONTENT_STAFF";

    // Set session cookie
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      roles,
      primaryRole,
    });

    // Record login in audit trail
    try {
      await db.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          action: "LOGIN",
          contentType: "User",
          contentId: user.id,
          changes: JSON.stringify({ role: primaryRole, timestamp: new Date().toISOString() }),
        },
      });
    } catch (auditErr) {
      console.error("[AUTH AUDIT ERROR]", auditErr);
    }

    return { success: true, redirectUrl: "/admin" };
  } catch (error: unknown) {
    console.error("[LOGIN ACTION ERROR]", error);
    return {
      error: "An unexpected error occurred during authentication. Please try again.",
    };
  }
}

/**
 * Staff Logout Server Action
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/**
 * Request Password Reset Action (Generates Token & Stubs Email Send)
 */
export async function requestPasswordResetAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email) {
    return { error: "Please enter your staff email address." };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return ambiguous message to prevent email harvesting
      return {
        success: true,
        message: "If an active staff account is associated with this email, a password reset link has been dispatched.",
      };
    }

    // Generate cryptographically secure token
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Clear any previous tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save token
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const resetUrl = `/admin/reset-password?token=${token}`;

    // Log stubbed email for local development / testing
    console.log("=================================================");
    console.log(`🔑 [PASSWORD RESET] Reset requested for: ${email}`);
    console.log(`🔗 Link: http://localhost:3000${resetUrl}`);
    console.log(`⏳ Expires in 60 minutes`);
    console.log("=================================================");

    return {
      success: true,
      message: "If an active staff account is associated with this email, a password reset link has been dispatched.",
      devResetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    };
  } catch (error: unknown) {
    console.error("[PASSWORD RESET REQUEST ERROR]", error);
    return {
      error: "Unable to process password reset request right now. Please try again later.",
    };
  }
}

/**
 * Reset Password using Token Action
 */
export async function resetPasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const token = formData.get("token")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!token) {
    return { error: "Invalid or missing password reset token." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const tokenRecord = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return {
        error: "This password reset token is invalid or has already been used. Please request a new link.",
      };
    }

    if (new Date() > tokenRecord.expiresAt) {
      // Clean up expired token
      await db.passwordResetToken.delete({ where: { token } });
      return {
        error: "This password reset link has expired. Please request a new link.",
      };
    }

    const user = await db.user.findUnique({
      where: { email: tokenRecord.email },
    });

    if (!user) {
      return { error: "User associated with this reset token no longer exists." };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete all tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email: user.email },
    });

    // Audit log
    try {
      await db.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          action: "UPDATE",
          contentType: "User",
          contentId: user.id,
          changes: JSON.stringify({ event: "PASSWORD_RESET" }),
        },
      });
    } catch {
      // no-op
    }

    return {
      success: true,
      message: "Your password has been successfully reset. You can now sign in with your new credentials.",
    };
  } catch (error: unknown) {
    console.error("[PASSWORD RESET ERROR]", error);
    return {
      error: "Failed to reset password. Please try again.",
    };
  }
}
