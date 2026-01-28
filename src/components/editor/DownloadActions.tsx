"use client";

import React, { useState, useCallback } from "react";
import { useBiodata } from "@/context/BiodataContext";
import { downloadPDF } from "@/lib/pdf-generator";
import { Button } from "@/components/ui";
import { toast } from "@/hooks/useToast";
import { Download, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface DownloadActionsProps {
  className?: string;
}

/**
 * DownloadActions Component
 * Handles PDF download with loading state and progress feedback
 */
export function DownloadActions({ className }: DownloadActionsProps) {
  const { biodata } = useBiodata();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "generating" | "success" | "error">("idle");

  /**
   * Get the person's name for file naming
   */
  const getPersonName = useCallback((): string => {
    const personalSection = biodata.sections.find((s) => s.id === "personal");
    const nameField = personalSection?.fields.find((f) => f.id === "name");
    return nameField?.value || "Biodata";
  }, [biodata]);

  /**
   * Generate the filename for the PDF
   */
  const generateFilename = useCallback((): string => {
    const personName = getPersonName();
    const safeName = personName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    const date = new Date().toISOString().split("T")[0];
    return `biodata_${safeName}_${date}.pdf`;
  }, [getPersonName]);

  /**
   * Handle PDF download
   */
  const handleDownloadPDF = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setDownloadStatus("generating");

    try {
      await downloadPDF(biodata);
      
      setDownloadStatus("success");
      toast({
        title: "PDF Downloaded Successfully!",
        description: `Your biodata has been saved as ${generateFilename()}`,
        variant: "success",
      });

      // Reset status after a delay
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setDownloadStatus("error");
      
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });

      // Reset status after a delay
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  }, [biodata, isGenerating, generateFilename]);

  /**
   * Get button icon based on status
   */
  const getButtonIcon = () => {
    switch (downloadStatus) {
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  /**
   * Get button text based on status
   */
  const getButtonText = () => {
    switch (downloadStatus) {
      case "generating":
        return "Generating PDF...";
      case "success":
        return "Downloaded!";
      case "error":
        return "Try Again";
      default:
        return "Download PDF";
    }
  };

  return (
    <div className={className}>
      {/* Main Download Button */}
      <Button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        variant={downloadStatus === "error" ? "destructive" : "primary"}
        className="w-full gap-2"
        size="lg"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {/* Filename Preview */}
      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <FileText className="h-3 w-3" />
        <span className="truncate">{generateFilename()}</span>
      </div>

      {/* Generation Info */}
      {downloadStatus === "generating" && (
        <p className="mt-2 text-center text-xs text-muted-foreground animate-pulse">
          Please wait while we prepare your biodata...
        </p>
      )}

      {/* Tips */}
      <div className="mt-4 rounded-md bg-muted/50 p-3">
        <p className="text-xs font-medium text-foreground mb-1">PDF Tips:</p>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          <li>• A4 size, ready for printing</li>
          <li>• All sections and fields included</li>
          <li>• Professional formatting applied</li>
        </ul>
      </div>
    </div>
  );
}

export default DownloadActions;
