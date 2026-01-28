"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet } from "@/hooks";
import { Button } from "@/components/ui";
import { PanelLeftClose, PanelRightClose, Eye, Edit3 } from "lucide-react";

interface EditorLayoutProps {
  formPanel: React.ReactNode;
  previewPanel: React.ReactNode;
  className?: string;
}

/**
 * EditorLayout - Responsive layout for the biodata editor
 * Desktop: Side-by-side (Form 45%, Preview 55%)
 * Mobile/Tablet: Stacked with toggle between form and preview
 */
export function EditorLayout({
  formPanel,
  previewPanel,
  className,
}: EditorLayoutProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isCompact = isMobile || isTablet;

  const [activePanel, setActivePanel] = useState<"form" | "preview">("form");
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  // Desktop layout - side by side
  if (!isCompact) {
    return (
      <div className={cn("flex h-full w-full", className)}>
        {/* Form Panel */}
        <div
          className={cn(
            "flex flex-col overflow-hidden border-r border-border bg-background transition-all duration-300",
            isPreviewCollapsed ? "w-full" : "w-[45%]"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-semibold text-foreground">Edit Biodata</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
              title={isPreviewCollapsed ? "Show Preview" : "Hide Preview"}
            >
              {isPreviewCollapsed ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">{formPanel}</div>
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            "flex flex-col overflow-hidden bg-muted transition-all duration-300",
            isPreviewCollapsed ? "w-0" : "w-[55%]"
          )}
        >
          {!isPreviewCollapsed && (
            <>
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-semibold text-foreground">Live Preview</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{previewPanel}</div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Mobile/Tablet layout - stacked with toggle
  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Toggle Header */}
      <div className="flex items-center justify-center gap-2 border-b border-border bg-background px-4 py-3">
        <Button
          variant={activePanel === "form" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActivePanel("form")}
          className="flex-1"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={activePanel === "preview" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActivePanel("preview")}
          className="flex-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activePanel === "form" ? (
          <div className="bg-background">{formPanel}</div>
        ) : (
          <div className="bg-muted p-4">{previewPanel}</div>
        )}
      </div>
    </div>
  );
}

export default EditorLayout;
