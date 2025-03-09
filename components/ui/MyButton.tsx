"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MyButton.displayName = "MyButton";
