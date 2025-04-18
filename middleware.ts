import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./app/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const publicPaths = ["/"];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Allow access to home page without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected routes
  if (
    !session &&
    !request.nextUrl.pathname.startsWith("/Login") &&
    !request.nextUrl.pathname.startsWith("/Register") &&
    !request.nextUrl.pathname.startsWith("/Forgotpassword") &&
    !request.nextUrl.pathname.startsWith("/Resetpassword") &&
    !request.nextUrl.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // Check for Dashboard access
  if (request.nextUrl.pathname.startsWith("/Dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }

    // Check if user has Admin role
    if (session.role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
