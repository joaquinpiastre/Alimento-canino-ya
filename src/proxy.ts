import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/mi-cuenta");

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL("/ingresar", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/mi-cuenta/:path*"],
};
