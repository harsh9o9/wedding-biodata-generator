"use client";

import React from "react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Eye, EyeOff, Trash2, GripVertical, Settings } from "lucide-react";
import { BiodataField } from "@/types/biodata";
import { cn } from "@/lib/utils";

interface FieldActionsProps {
  field: BiodataField;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onEdit?: () => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  className?: string;
  compact?: boolean;
}

/**
 * FieldActions - Action buttons for field management (edit, delete, visibility, drag)
 */
export function FieldActions({
  field,
  onToggleVisibility,
  onRemove,
  onEdit,
  isDragging,
  dragHandleProps,
  className,
  compact = false,
}: FieldActionsProps) {
  const handleRemoveClick = () => {
    onRemove();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex items-center gap-1",
          compact ? "gap-0.5" : "gap-1",
          className
        )}
      >
        {/* Drag Handle */}
        {dragHandleProps && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                {...dragHandleProps}
                className={cn(
                  "cursor-grab rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing",
                  isDragging && "cursor-grabbing bg-muted text-foreground"
                )}
              >
                <GripVertical className={compact ? "h-3 w-3" : "h-4 w-4"} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Drag to reorder</TooltipContent>
          </Tooltip>
        )}

        {/* Edit Button */}
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  compact && "h-6 w-6"
                )}
              >
                <Settings className={compact ? "h-3 w-3" : "h-4 w-4"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit field settings</TooltipContent>
          </Tooltip>
        )}

        {/* Toggle Visibility */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                compact && "h-6 w-6"
              )}
            >
              {field.visible ? (
                <Eye className={compact ? "h-3 w-3" : "h-4 w-4"} />
              ) : (
                <EyeOff className={cn(compact ? "h-3 w-3" : "h-4 w-4", "opacity-50")} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {field.visible ? "Hide in biodata" : "Show in biodata"}
          </TooltipContent>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveClick}
              className={cn(
                "text-muted-foreground hover:text-destructive",
                compact && "h-6 w-6"
              )}
            >
              <Trash2 className={compact ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove field</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default FieldActions;
