"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);

  // Skip the initial animation on first page load
  useEffect(() => {
    setIsFirstMount(false);
  }, []);

  // Only apply fade-in effect to new pages, no fade-out for the current page
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 1 }} // Ensures no fade-out effect
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
