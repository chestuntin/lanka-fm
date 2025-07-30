import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    function check() {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    }
    
    check();
    window.addEventListener("resize", check);
    
    return () => window.removeEventListener("resize", check);
  }, []);
  
  return isMobile;
}