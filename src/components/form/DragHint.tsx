"use client";

import React, { useState, useEffect } from "react";
import { Info, X } from "lucide-react";
import { Button, Kbd } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * DragHint - Shows a dismissible hint about drag-and-drop functionality
 * Appears once per session and can be dismissed
 */
export function DragHint() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hintDismissed = localStorage.getItem("drag-hint-dismissed");
    
    if (!hintDismissed && !hasBeenShown) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasBeenShown]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("drag-hint-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "max-w-sm rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-lg",
        "animate-in slide-in-from-bottom-5 fade-in duration-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            💡 Tip: Reorder your fields
          </p>
          <p className="text-xs text-muted-foreground">
            Hover over any field to see the drag handle (⋮⋮). Use your mouse to drag or press{" "}
            <Kbd>Space</Kbd> + <Kbd>↑↓</Kbd> on keyboard.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={handleDismiss}
          aria-label="Dismiss hint"
        >
          <X className="h-4 w-4 text-inherit" />
        </Button>
      </div>
    </div>
  );
}
