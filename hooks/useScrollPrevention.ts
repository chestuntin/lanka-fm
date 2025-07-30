import { useEffect } from "react";
import { getSafeViewportDimensions } from "@/utils/viewport";

export function useScrollPrevention(isMobile: boolean, messageCount: number) {
  // Prevent scrolling on mobile when messages are present
  useEffect(() => {
    if (!isMobile) return;

    const html = document.documentElement;
    const body = document.body;

    if (messageCount > 0) {
      const safeDimensions = getSafeViewportDimensions();
      const safeHeight = safeDimensions.height;
      
      html.style.overflow = "hidden";
      html.style.height = `${safeHeight}px`;
      body.style.overflow = "hidden";
      body.style.height = `${safeHeight}px`;
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = "0";
      body.style.left = "0";
    } else {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      body.style.left = "";
    }

    return () => {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      body.style.left = "";
    };
  }, [messageCount, isMobile]);

  // Prevent touch scroll on logos
  useEffect(() => {
    const preventTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button")
      ) {
        return;
      }
      e.preventDefault();
    };

    if (isMobile && messageCount > 0) {
      document.addEventListener("touchmove", preventTouch, { passive: false });
      document.addEventListener("touchstart", preventTouch, { passive: false });
    }

    return () => {
      document.removeEventListener("touchmove", preventTouch);
      document.removeEventListener("touchstart", preventTouch);
    };
  }, [isMobile, messageCount]);
}