import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("next-auth.session-token"); // or however you store your session

  if (!session && request.nextUrl.pathname.startsWith("/checkout")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};
