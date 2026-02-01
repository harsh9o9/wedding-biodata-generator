"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableSectionWrapperProps {
  id: string;
  children: (props: {
    dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
    isDragging: boolean;
  }) => React.ReactNode;
  disabled?: boolean;
}

/**
 * DraggableSectionWrapper - Wraps a section with drag-and-drop functionality
 * Supports keyboard (space/enter + arrows), mouse, and touch interactions
 */
export function DraggableSectionWrapper({
  id,
  children,
  disabled = false,
}: DraggableSectionWrapperProps) {
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

  const dragHandleProps = disabled
    ? undefined
    : {
        ...attributes,
        ...listeners,
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-50"
      )}
    >
      {children({ dragHandleProps, isDragging })}
    </div>
  );
}
