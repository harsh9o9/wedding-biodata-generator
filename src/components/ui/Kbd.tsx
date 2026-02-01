import React from "react";
import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * Kbd - Keyboard shortcut display component
 * Displays keyboard keys in a styled format
 */
export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "px-1.5 py-0.5 min-w-6",
        "text-xs font-semibold",
        "bg-muted border border-border rounded",
        "shadow-sm",
        "font-mono",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
