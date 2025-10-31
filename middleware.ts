import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl;

  // If on links subdomain, redirect to root
  if (host.startsWith("links.")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware on routes that are not static files or Next.js internals
export const config = {
  matcher: [
    /*
      Match all request paths except for the ones starting with:
      - _next
      - static
      - favicon.ico
      - robots.txt
      - etc.
    */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
