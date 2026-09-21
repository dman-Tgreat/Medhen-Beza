import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  SessionUser,
  signSessionToken,
  verifySessionToken,
} from "./jwt";

/**
 * Set the session cookie on successful authentication (Server Actions / Route Handlers)
 */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await signSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Retrieve the verified session in Server Components, Server Actions, and Route Handlers
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!tokenCookie?.value) {
    return null;
  }

  const payload = await verifySessionToken(tokenCookie.value);
  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
    roles: payload.roles || [],
    primaryRole: payload.primaryRole || payload.roles?.[0] || "CONTENT_STAFF",
  };
}

/**
 * Remove the session cookie (Sign Out)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Guard for server components and actions: throws/redirects if user is not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Guard for server components and actions: verifies user possesses at least one of the allowed roles
 */
export async function requireRole(allowedRoles: string[]): Promise<SessionUser> {
  const session = await requireAuth();
  const hasRole = session.roles.some((r) => allowedRoles.includes(r));

  if (!hasRole) {
    redirect("/admin?error=unauthorized");
  }

  return session;
}
