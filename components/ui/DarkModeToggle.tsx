"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true); // Start with dark mode (black)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("dark"); // Black background
    } else {
      document.documentElement.classList.add("dark"); // White background
    }
  }, [isDark]);

  return (
    <Button onClick={() => setIsDark(!isDark)} variant="outline">
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
