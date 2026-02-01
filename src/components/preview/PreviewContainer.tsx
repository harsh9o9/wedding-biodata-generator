"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useBiodata } from "@/context/BiodataContext";
import { TEMPLATES } from "@/constants/templates";
import { A4, DELAYS } from "@/constants/theme";
import { Button } from "@/components/ui";
import { ZoomIn, ZoomOut, RotateCcw, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { downloadPDF } from "@/lib/pdf-generator";
import { getTemplateComponent } from "@/components/templates";
import { useToast } from "@/hooks/useToast";

interface PreviewContainerProps {
  className?: string;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5];
const DEFAULT_ZOOM = 0.75;

/**
 * PreviewContainer - A4 aspect ratio preview with zoom controls and PDF download
 * Features real-time preview with debounced updates and template rendering
 */
export function PreviewContainer({ className }: PreviewContainerProps) {
  const { biodata, previewRef } = useBiodata();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Debounce biodata updates for preview (300ms)
  const debouncedBiodata = useDebounce(biodata, DELAYS.preview);

  // Get template configuration
  const template = useMemo(
    () => TEMPLATES[debouncedBiodata.templateId],
    [debouncedBiodata.templateId]
  );

  // Get the appropriate template component
  const TemplateComponent = useMemo(
    () => getTemplateComponent(debouncedBiodata.templateId),
    [debouncedBiodata.templateId]
  );

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  }, [zoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
  }, []);

  // PDF Download handler - now uses html2canvas + jsPDF
  const handleDownload = useCallback(async () => {
    if (!previewRef.current) {
      toast({
        title: "Error",
        description: "Preview element not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      // Use the current biodata (not debounced) for the actual download
      await downloadPDF(biodata, {
        element: previewRef.current,
        scale: 2, // Higher scale for better quality
        includeBackground: true,
      });
      toast({
        title: "PDF Downloaded!",
        description: "Your biodata has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "Download Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [biodata, previewRef, toast]);

  // Calculate preview dimensions
  const previewWidth = A4.widthPx * zoom;
  const previewHeight = A4.heightPx * zoom;

  // Add overlay if configured
  const overlayStyle = useMemo((): React.CSSProperties | null => {
    const overlay = debouncedBiodata.background.overlay;
    if (!overlay) return null;

    return {
      position: "absolute" as const,
      inset: 0,
      backgroundColor: overlay.color,
      opacity: overlay.opacity / 100,
      pointerEvents: "none" as const,
    };
  }, [debouncedBiodata.background.overlay]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Zoom Controls */}
      <div className="flex items-center justify-between rounded-lg bg-card p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom === ZOOM_LEVELS[0]}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 text-foreground" />
          </Button>
          <span className="min-w-16 text-center text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4 text-foreground" />
          </Button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4 text-primary-foreground" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto rounded-lg bg-muted/50 p-4">
        <div
          className="mx-auto"
          style={{ width: previewWidth, minHeight: previewHeight }}
        >
          {/* A4 Page Preview */}
          <div
            ref={previewRef}
            className="relative overflow-hidden shadow-2xl transition-all duration-200"
            style={{
              width: previewWidth,
              height: previewHeight,
              backgroundColor: debouncedBiodata.background.type === 'color' 
                ? (debouncedBiodata.background.value.startsWith("var(")
                    ? template.colors.background
                    : debouncedBiodata.background.value)
                : template.colors.background,
            }}
          >
            {/* Background Image/Pattern Layer */}
            {/* Note: Using <img> instead of Next.js <Image> for html2canvas compatibility.
                The Image component's optimization interferes with PDF generation. */}
            {(debouncedBiodata.background.type === 'image' || debouncedBiodata.background.type === 'pattern') && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={debouncedBiodata.background.value}
                alt=""
                className="absolute inset-0 h-full w-full"
                style={{
                  objectFit: debouncedBiodata.background.type === 'image' ? 'cover' : 'none',
                  objectPosition: 'center',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            )}
            
            {/* Gradient Background Layer */}
            {debouncedBiodata.background.type === 'gradient' && (
              <div
                className="absolute inset-0"
                style={{
                  background: debouncedBiodata.background.value,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            )}

            {/* Background overlay */}
            {overlayStyle && <div style={{ ...overlayStyle, zIndex: 1 }} />}

            {/* Template Content */}
            <TemplateComponent
              biodata={debouncedBiodata}
              template={template}
              scale={zoom}
            />
          </div>
        </div>
      </div>

      {/* Page Info */}
      <div className="text-center text-xs text-muted-foreground">
        A4 Format • 210mm × 297mm • {template.name}
      </div>
    </div>
  );
}

export default PreviewContainer;
