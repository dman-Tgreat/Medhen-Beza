import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/jwt";
import { isValidLocale, LOCALES, DEFAULT_LOCALE, SupportedLocale } from "@/lib/i18n/config";
import { detectBrowserLocale } from "@/lib/i18n/detect-locale";

// Public admin routes that do not require an active session
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── 1. Admin Routes Authentication ───────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.some(
      (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
    );

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const sessionToken = sessionCookie?.value;
    const session = sessionToken ? await verifySessionToken(sessionToken) : null;

    // Unauthenticated visitor trying to access a protected /admin route
    if (!session && !isPublicAdminRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated visitor accessing login/auth pages -> redirect directly to admin dashboard
    if (session && isPublicAdminRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Inject authenticated user context in headers for downstream Server Components
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

  // ─── 2. Bypass API, Static & Asset Routes ──────────────────────────────────
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ─── 3. Public Route Localization ──────────────────────────────────────────
  const pathnameSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathnameSegments[0];

  // If the URL is already prefixed with a valid locale (/en/..., /am/..., /om/...)
  if (firstSegment && isValidLocale(firstSegment)) {
    const currentLocale = firstSegment as SupportedLocale;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", currentLocale);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Refresh NEXT_LOCALE cookie to keep user's active choice
    response.cookies.set("NEXT_LOCALE", currentLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  }

  // If URL has NO locale prefix (e.g. "/", "/about", "/doctors")
  // Determine target language: User cookie > Browser Accept-Language header > Default English
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const targetLocale: SupportedLocale =
    cookieLocale && isValidLocale(cookieLocale)
      ? (cookieLocale as SupportedLocale)
      : detectBrowserLocale(request.headers.get("accept-language"));

  const targetPath = `/${targetLocale}${pathname === "/" ? "" : pathname}${request.nextUrl.search}`;
  const redirectUrl = new URL(targetPath, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("NEXT_LOCALE", targetLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
