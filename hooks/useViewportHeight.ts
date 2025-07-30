import { useEffect, useState } from "react";
import { getSafeViewportDimensions } from "@/utils/viewport";

export function useViewportHeight(isMobile: boolean) {
  const [initialViewportHeight, setInitialViewportHeight] = useState<number>(0);

  // Mobile viewport height management
  useEffect(() => {
    if (!isMobile) return;

    const safeDimensions = getSafeViewportDimensions();
    const initialHeight = safeDimensions.height;
    setInitialViewportHeight(initialHeight);

    function handleViewportChange() {
      const currentSafeDimensions = getSafeViewportDimensions();
      document.documentElement.style.setProperty(
        "--app-vh",
        `${currentSafeDimensions.height}px`
      );
    }

    handleViewportChange();

    let timeoutId: NodeJS.Timeout;
    function debouncedHandleViewportChange() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleViewportChange, 100);
    }

    window.addEventListener("resize", debouncedHandleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", debouncedHandleViewportChange);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedHandleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", debouncedHandleViewportChange);
      }
    };
  }, [isMobile]);

  // Desktop viewport handling
  useEffect(() => {
    if (isMobile) return;

    function setVh() {
      const safeDimensions = getSafeViewportDimensions();
      document.documentElement.style.setProperty(
        "--app-vh",
        `${safeDimensions.height}px`
      );
    }

    setVh();
    window.addEventListener("resize", setVh);
    
    return () => window.removeEventListener("resize", setVh);
  }, [isMobile]);

  return initialViewportHeight;
}