"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Card, CardContent } from "@/components/ui";
import { Plus, RotateCcw, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useBiodata } from "@/context/BiodataContext";
import { useBiodataForm } from "@/hooks";
import { FormSection } from "./FormSection";
import { DraggableSectionWrapper } from "./DraggableSectionWrapper";
import { AddFieldModal } from "./AddFieldModal";
import { AddSectionModal } from "./AddSectionModal";
import { BiodataField, BiodataSection } from "@/types/biodata";
import { cn } from "@/lib/utils";

interface BiodataFormProps {
  showHindiLabels?: boolean;
  className?: string;
}

/**
 * BiodataForm - Main form container with all sections
 */
export function BiodataForm({
  showHindiLabels = false,
  className,
}: BiodataFormProps) {
  const {
    biodata,
    addField,
    addSection,
    removeSection,
    dispatch,
    reorderSections,
  } = useBiodata();

  const {
    isSaving,
    lastSaved,
    completionPercentage,
    validationResult,
    hasValidated,
    resetForm,
  } = useBiodataForm();

  // Modal states
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Sort sections by order
  const sortedSections = useMemo(
    () => [...biodata.sections].sort((a, b) => a.order - b.order),
    [biodata.sections]
  );

  // Setup drag-and-drop sensors for mouse, touch, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event for sections
  const handleSectionDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
        const newIndex = sortedSections.findIndex((s) => s.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedSections = arrayMove(sortedSections, oldIndex, newIndex);
          const sectionIds = reorderedSections.map((s) => s.id);
          reorderSections(sectionIds);
        }
      }
    },
    [sortedSections, reorderSections]
  );

  // Handle adding field to a specific section
  const handleAddFieldToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setAddFieldModalOpen(true);
  }, []);

  // Handle field addition
  const handleAddField = useCallback(
    (field: Omit<BiodataField, "id" | "order">) => {
      if (activeSection) {
        addField(activeSection, field);
      }
    },
    [activeSection, addField]
  );

  // Handle section addition
  const handleAddSection = useCallback(
    (section: Omit<BiodataSection, "id" | "order">) => {
      addSection(section);
    },
    [addSection]
  );

  // Handle section removal
  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      removeSection(sectionId);
    },
    [removeSection]
  );

  // Toggle section visibility
  const handleToggleSectionVisibility = useCallback(
    (sectionId: string) => {
      const section = biodata.sections.find((s) => s.id === sectionId);
      if (section) {
        dispatch({
          type: "UPDATE_SECTION",
          sectionId,
          updates: { visible: !section.visible },
        });
      }
    },
    [biodata.sections, dispatch]
  );

  // Get active section name for modal
  const activeSectionName = activeSection
    ? biodata.sections.find((s) => s.id === activeSection)?.title
    : undefined;

  // Format last saved time
  const lastSavedText = lastSaved
    ? `Last saved: ${new Date(lastSaved).toLocaleTimeString()}`
    : "Not saved yet";

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Form Header with Status */}
      <div className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Completion Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {completionPercentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">
                {completionPercentage}% complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-muted sm:block">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Save Status & Actions */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {isSaving ? (
                <>
                  <Save className="mr-1 inline h-3 w-3 animate-pulse" />
                  Saving...
                </>
              ) : (
                lastSavedText
              )}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              title="Reset form"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Validation Errors */}
        {hasValidated && !validationResult.isValid && (
          <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2">
            <p className="text-sm text-destructive">
              Please fix {validationResult.errors.length} error(s) before downloading.
            </p>
          </div>
        )}
      </div>

      {/* Form Sections */}
      <div className="flex-1 space-y-4 p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sortedSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section, index) => (
              <DraggableSectionWrapper
                key={section.id}
                id={section.id}
                disabled={!section.visible}
              >
                {({ dragHandleProps, isDragging }) => (
                  <FormSection
                    section={section}
                    onAddField={() => handleAddFieldToSection(section.id)}
                    onRemoveSection={() => handleRemoveSection(section.id)}
                    onToggleVisibility={() => handleToggleSectionVisibility(section.id)}
                    dragHandleProps={dragHandleProps}
                    isDragging={isDragging}
                    showHindiLabels={showHindiLabels}
                    defaultExpanded={index < 3} // First 3 sections expanded by default
                  />
                )}
              </DraggableSectionWrapper>
            ))}
          </SortableContext>
        </DndContext>

        {/* Add Section Button */}
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center p-6">
            <Button
              variant="ghost"
              onClick={() => setAddSectionModalOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Section
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Field Modal */}
      <AddFieldModal
        open={addFieldModalOpen}
        onOpenChange={setAddFieldModalOpen}
        onAddField={handleAddField}
        sectionName={activeSectionName}
      />

      {/* Add Section Modal */}
      <AddSectionModal
        open={addSectionModalOpen}
        onOpenChange={setAddSectionModalOpen}
        onAddSection={handleAddSection}
      />
    </div>
  );
}

export default BiodataForm;
