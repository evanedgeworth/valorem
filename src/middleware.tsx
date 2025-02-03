import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const accessToken = req.cookies.get("accessToken");

  // if user is signed in and the current path is / redirect the user to /account
  if (accessToken && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/properties", req.url));
  }

  // if (
  //   !accessToken &&
  //   req.nextUrl.pathname !== "/" &&
  //   req.nextUrl.pathname !== "/login" &&
  //   req.nextUrl.pathname !== "/signup" &&
  //   req.nextUrl.pathname !== "/forgot" &&
  //   req.nextUrl.pathname !== "/update-password" &&
  //   req.nextUrl.pathname !== "/email-confirmation"
  // ) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
