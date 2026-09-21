import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/jwt";

// Public admin routes that do not require an active session
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.some(
    (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const sessionToken = sessionCookie?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  // 1. Unauthenticated visitor trying to access a protected /admin route
  if (!session && !isPublicAdminRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated visitor accessing login/auth pages -> redirect directly to admin dashboard
  if (session && isPublicAdminRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 3. Inject authenticated user context in headers for downstream Server Components
  const requestHeaders = new Headers(request.headers);
  if (session) {
    requestHeaders.set("x-user-id", session.id);
    requestHeaders.set("x-user-email", session.email);
    requestHeaders.set("x-user-role", session.primaryRole);
    requestHeaders.set("x-user-roles", JSON.stringify(session.roles));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
