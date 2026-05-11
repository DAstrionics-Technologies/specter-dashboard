import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware for route gating.
 *
 * Cheap fast check: does the session cookie exist? If not and we're trying
 * to load any non-public route, redirect to /login. This avoids a flash
 * of authenticated UI while the AuthProvider is still validating /me.
 *
 * The cookie is HttpOnly and we can't validate its contents here — that's
 * the AuthProvider's job. Middleware just enforces "you have *some* cookie
 * before we render the dashboard shell."
 */

const PUBLIC_PATHS = new Set<string>(["/login"]);
const SESSION_COOKIE = "specter_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // Logged-out user trying to load a protected page → bounce to /login,
  // remembering where they were headed so we can redirect back after auth.
  if (!hasSession && !PUBLIC_PATHS.has(pathname)) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") {
      url.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(url);
  }

  // Logged-in user trying to revisit /login → bounce to home.
  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static assets. Everything else gets gated.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
