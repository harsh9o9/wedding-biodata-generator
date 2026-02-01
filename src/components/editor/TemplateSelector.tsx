"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { TEMPLATE_LIST } from "@/constants/templates";
import { useBiodata } from "@/context/BiodataContext";
import { TemplateId } from "@/types/biodata";
import { Check, Palette, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  className?: string;
  compact?: boolean;
}

/**
 * TemplateSelector - Grid of template thumbnails for selection
 */
export function TemplateSelector({ className, compact = false }: TemplateSelectorProps) {
  const { biodata, setTemplate } = useBiodata();
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectTemplate = (templateId: TemplateId) => {
    setTemplate(templateId);
  };

  const handlePreview = (templateId: TemplateId, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTemplate(templateId);
    setIsDialogOpen(true);
  };

  const selectedTemplate = TEMPLATE_LIST.find((t) => t.id === biodata.templateId);
  const previewTemplateData = previewTemplate
    ? TEMPLATE_LIST.find((t) => t.id === previewTemplate)
    : null;

  // Compact view - shows current template with button to change
  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Template</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {selectedTemplate?.name || "Classic"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {TEMPLATE_LIST.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-md border-2 transition-all",
                biodata.templateId === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              title={template.name}
            >
              {/* Color Preview */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Header Bar */}
                <div
                  className="h-3"
                  style={{ backgroundColor: template.colors.primary }}
                />
                {/* Content Preview */}
                <div className="space-y-1 p-1.5">
                  <div
                    className="h-1.5 w-full rounded-sm"
                    style={{ backgroundColor: template.colors.secondary }}
                  />
                  <div
                    className="h-1 w-3/4 rounded-sm opacity-50"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div
                    className="h-1 w-1/2 rounded-sm opacity-30"
                    style={{ backgroundColor: template.colors.text }}
                  />
                </div>
                {/* Border Preview */}
                <div
                  className="absolute inset-0 border-2 opacity-50"
                  style={{ borderColor: template.colors.border }}
                />
              </div>

              {/* Selected Indicator */}
              {biodata.templateId === template.id && (
                <div className="absolute right-0.5 top-0.5 rounded-full bg-primary p-0.5 text-primary-foreground">
                  <Check className="h-2.5 w-2.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full view - detailed template cards
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="h-5 w-5 text-primary" />
          Choose Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TEMPLATE_LIST.map((template) => (
            <div
              key={template.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:shadow-md",
                biodata.templateId === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Template Preview */}
              <div
                className="aspect-[3/4] p-3"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Header */}
                <div
                  className="mb-2 h-4 rounded"
                  style={{ backgroundColor: template.colors.primary }}
                />

                {/* Content Lines */}
                <div className="space-y-1.5">
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: template.colors.secondary }}
                  />
                  <div
                    className="h-1.5 w-3/4 rounded opacity-50"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div
                    className="h-1.5 w-1/2 rounded opacity-30"
                    style={{ backgroundColor: template.colors.text }}
                  />
                </div>

                {/* Decorative Border */}
                <div
                  className="absolute inset-2 rounded border-2 opacity-30"
                  style={{ borderColor: template.colors.border }}
                />

                {/* Accent Element */}
                <div
                  className="absolute bottom-3 right-3 h-3 w-3 rounded-full"
                  style={{ backgroundColor: template.colors.accent }}
                />
              </div>

              {/* Template Name */}
              <div className="border-t border-border bg-card p-2">
                <p className="text-center text-xs font-medium">{template.name}</p>
              </div>

              {/* Selected Indicator */}
              {biodata.templateId === template.id && (
                <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {/* Preview Button - Show on Hover */}
              <button
                onClick={(e) => handlePreview(template.id, e)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Eye className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplateData?.name}</DialogTitle>
            <DialogDescription>{previewTemplateData?.description}</DialogDescription>
          </DialogHeader>

          {previewTemplateData && (
            <div className="space-y-4">
              {/* Large Preview */}
              <div
                className="aspect-[3/4] max-h-[60vh] overflow-hidden rounded-lg p-6"
                style={{ backgroundColor: previewTemplateData.colors.background }}
              >
                {/* Header */}
                <div
                  className="mb-4 rounded-lg p-4"
                  style={{ backgroundColor: previewTemplateData.colors.primary }}
                >
                  <div
                    className="h-6 w-2/3 rounded"
                    style={{
                      backgroundColor: previewTemplateData.colors.background,
                      opacity: 0.9,
                    }}
                  />
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border p-4" style={{
                      borderColor: previewTemplateData.colors.border,
                    }}>
                      <div
                        className="mb-2 h-4 w-1/3 rounded"
                        style={{ backgroundColor: previewTemplateData.colors.secondary }}
                      />
                      <div className="space-y-2">
                        <div
                          className="h-3 w-full rounded"
                          style={{
                            backgroundColor: previewTemplateData.colors.text,
                            opacity: 0.2,
                          }}
                        />
                        <div
                          className="h-3 w-3/4 rounded"
                          style={{
                            backgroundColor: previewTemplateData.colors.text,
                            opacity: 0.15,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div
                  className="absolute bottom-4 right-4 h-8 w-8 rounded-full"
                  style={{ backgroundColor: previewTemplateData.colors.accent }}
                />
              </div>

              {/* Color Palette */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(previewTemplateData.colors).map(([name, color]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-md bg-muted px-2 py-1"
                  >
                    <div
                      className="h-4 w-4 rounded border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs capitalize">{name}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (previewTemplate) {
                      handleSelectTemplate(previewTemplate);
                    }
                    setIsDialogOpen(false);
                  }}
                >
                  <Check className="mr-2 h-4 w-4 text-inherit" />
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default TemplateSelector;
