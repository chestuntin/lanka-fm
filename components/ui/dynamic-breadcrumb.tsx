"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const [browser, setBrowser] = useState<string>("Browser");

  useEffect(() => {
    // Detect browser on client side
    const userAgent = window.navigator.userAgent;
    let browserName = "Browser";

    // Check for Arc browser first (needs to be before Chrome check)
    if (userAgent.indexOf("Arc") > -1) {
      browserName = "Arc";
    }
    // Check for Edge (needs to be before Chrome check)
    else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Edge";
    }
    // Check for Chrome
    else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
    }
    // Check for Firefox
    else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
    }
    // Safari must be checked last as Chrome also includes Safari in UA
    else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
    }

    setBrowser(browserName);
  }, []);

  // For homepage, show browser > kultjur.lk > main
  if (pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-400 hover:text-white transition-colors">
              {browser}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-400 hover:text-white transition-colors">
              Kultjur.lk
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Main</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // For other pages, generate dynamic breadcrumb
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      // Build the path up to this segment
      const segmentPath = "/" + array.slice(0, index + 1).join("/");
      return {
        name:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: segmentPath,
      };
    });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-gray-400 hover:text-white transition-colors">
            {browser}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Kultjur.lk
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => (
          <>
            <BreadcrumbSeparator key={`sep-${segment.href}`} />
            <BreadcrumbItem key={segment.href}>
              {index === segments.length - 1 ? (
                <BreadcrumbPage className="text-white">
                  {segment.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={segment.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {segment.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
