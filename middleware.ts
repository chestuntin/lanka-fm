import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl;

  // If on links.kultjur.lk and not already in /links, rewrite to /links
  if (host.startsWith("links.") && !url.pathname.startsWith("/links")) {
    url.pathname = "/links" + url.pathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
