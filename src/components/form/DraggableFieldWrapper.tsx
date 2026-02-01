"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, Kbd } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DraggableFieldWrapperProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * DraggableFieldWrapper - Wraps a field with drag-and-drop functionality
 * Supports keyboard (space/enter + arrows), mouse, and touch interactions
 */
export function DraggableFieldWrapper({
  id,
  children,
  disabled = false,
}: DraggableFieldWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-50"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "shrink-0 mt-8 p-1 rounded cursor-grab active:cursor-grabbing",
                "opacity-0 group-hover:opacity-100 focus:opacity-100",
                "transition-opacity duration-200",
                "hover:bg-muted focus:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "text-muted-foreground hover:text-foreground focus:text-foreground",
                disabled && "cursor-not-allowed opacity-30"
              )}
              aria-label="Drag to reorder field. Press Space to grab, use arrow keys to move, Space to drop."
              disabled={disabled}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs px-2 py-1.5">
            <div className="space-y-0.5">
              <div>Drag or <Kbd className="text-[10px] px-1 py-0">Space</Kbd> + <Kbd className="text-[10px] px-1 py-0">↑↓</Kbd></div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Field Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
