
import { useLayoutEffect, useState, RefObject } from "react";
import type { Bounds } from "@/types/bouncing";

export function useBoundsTracking(
  chatAreaRef: RefObject<HTMLDivElement>,
  chatInputRef: RefObject<HTMLDivElement>
) {
  const [chatBounds, setChatBounds] = useState<Bounds | null>(null);
  const [inputBounds, setInputBounds] = useState<Bounds | null>(null);

  useLayoutEffect(() => {
    function updateBounds() {
      if (chatAreaRef.current) {
        const rect = chatAreaRef.current.getBoundingClientRect();
        setChatBounds(rect);
      }
      
      if (chatInputRef.current) {
        const rect = chatInputRef.current.getBoundingClientRect();
        setInputBounds(rect);
      }
    }

    updateBounds();
    
    const handleResize = () => setTimeout(updateBounds, 50);
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [chatAreaRef, chatInputRef]);

  return { chatBounds, inputBounds };
}