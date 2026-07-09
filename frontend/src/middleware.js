import { NextResponse } from "next/server";

const COOKIE_NAME = "studysync_token";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/tasks",
  "/calendar",
  "/pomodoro",
  "/goals",
  "/analytics",
  "/notifications",
  "/achievements",
  "/ai-assistant",
  "/profile",
  "/settings",
];

const AUTH_ONLY_PATHS = ["/login", "/register"];

/**
 * Presence-only check (fast, Edge-safe) — the cookie's *signature and
 * expiry* are always verified server-side on every real API call via
 * `authenticate` middleware. This just avoids rendering protected UI (or
 * showing the login form to an already-authenticated user) before that
 * happens (03-AppFlow.md §25 Route Protection Flow).
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(COOKIE_NAME));

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ONLY_PATHS.includes(pathname) && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/calendar/:path*",
    "/pomodoro/:path*",
    "/goals/:path*",
    "/analytics/:path*",
    "/notifications/:path*",
    "/achievements/:path*",
    "/ai-assistant/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
