import { SignJWT, jwtVerify } from "jose";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  roles: string[];
  primaryRole: string;
}

export interface SessionPayload extends SessionUser {
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "medhen-beza-super-secret-jwt-key-2026-production";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = "medhen_admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Sign a session JWT payload (Edge & Node compatible)
 */
export async function signSessionToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(encodedKey);
}

/**
 * Verify and decode a session JWT token (Edge & Node compatible)
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
