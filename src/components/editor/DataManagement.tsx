"use client";

import React, { useState, useCallback, useRef } from "react";
import { useBiodata } from "@/context/BiodataContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import { toast } from "@/hooks/useToast";
import { validateJsonFile, validateBiodataExport, isCompatibleVersion, CURRENT_EXPORT_VERSION } from "@/lib/validators";
import {
  Download,
  Upload,
  FileJson,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileWarning,
  RefreshCcw,
} from "lucide-react";

interface DataManagementProps {
  className?: string;
}

/**
 * DataManagement Component
 * Handles JSON export/import and data reset functionality
 */
export function DataManagement({ className }: DataManagementProps) {
  const { biodata, exportData, importData, reset } = useBiodata();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    name: string;
    sections: number;
    exportedAt: string;
    version: string;
  } | null>(null);
  const [pendingImportData, setPendingImportData] = useState<ReturnType<typeof exportData> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Get person's name from biodata
   */
  const getPersonName = useCallback((): string => {
    const personalSection = biodata.sections.find((s) => s.id === "personal");
    const nameField = personalSection?.fields.find((f) => f.id === "name");
    return nameField?.value || "Biodata";
  }, [biodata]);

  /**
   * Generate filename for JSON export
   */
  const generateFilename = useCallback((): string => {
    const personName = getPersonName();
    const safeName = personName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    const date = new Date().toISOString().split("T")[0];
    return `biodata_${safeName}_${date}.json`;
  }, [getPersonName]);

  /**
   * Handle JSON export
   */
  const handleExportJSON = useCallback(() => {
    try {
      const data = exportData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = generateFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported Successfully!",
        description: `Your biodata has been saved as ${generateFilename()}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    }
  }, [exportData, generateFilename]);

  /**
   * Trigger file input click
   */
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle file selection for import
   */
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setImportError(null);
    setImportPreview(null);
    setPendingImportData(null);

    // Validate file type
    const fileValidation = validateJsonFile(file);
    if (!fileValidation.isValid) {
      setImportError(fileValidation.message || "Invalid file");
      setIsImportDialogOpen(true);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!validateBiodataExport(data)) {
        setImportError("The file format is invalid. Please ensure you're importing a biodata JSON file that was exported from this application.");
        setIsImportDialogOpen(true);
        return;
      }

      // Check version compatibility
      if (!isCompatibleVersion(data.version)) {
        setImportError(`This file was created with version ${data.version}, but the current version is ${CURRENT_EXPORT_VERSION}. The file format may not be compatible.`);
        setIsImportDialogOpen(true);
        return;
      }

      // Extract preview info
      const personalSection = data.data.sections.find((s: { id: string }) => s.id === "personal");
      const nameField = personalSection?.fields.find((f: { id: string }) => f.id === "name");
      
      setImportPreview({
        name: nameField?.value || "Unknown",
        sections: data.data.sections.length,
        exportedAt: new Date(data.exportedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        version: data.version,
      });
      setPendingImportData(data);
      setIsImportDialogOpen(true);
    } catch (error) {
      console.error("File parsing error:", error);
      setImportError("Failed to read the file. Please ensure it's a valid JSON file.");
      setIsImportDialogOpen(true);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  /**
   * Confirm and perform import
   */
  const handleConfirmImport = useCallback(() => {
    if (!pendingImportData) return;

    const success = importData(pendingImportData);
    
    if (success) {
      toast({
        title: "Data Imported Successfully!",
        description: `Biodata for "${importPreview?.name}" has been loaded.`,
        variant: "success",
      });
    } else {
      toast({
        title: "Import Failed",
        description: "There was an error importing the data. Please try again.",
        variant: "destructive",
      });
    }

    setIsImportDialogOpen(false);
    setImportPreview(null);
    setPendingImportData(null);
    setImportError(null);
  }, [pendingImportData, importData, importPreview]);

  /**
   * Handle reset confirmation
   */
  const handleConfirmReset = useCallback(() => {
    reset();
    setIsResetDialogOpen(false);
    
    toast({
      title: "Data Reset Complete",
      description: "All biodata has been cleared. You can start fresh now.",
      variant: "default",
    });
  }, [reset]);

  /**
   * Close import dialog
   */
  const handleCloseImportDialog = useCallback(() => {
    setIsImportDialogOpen(false);
    setImportError(null);
    setImportPreview(null);
    setPendingImportData(null);
  }, []);

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Import JSON file"
      />

      {/* Export/Import Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <FileJson className="h-5 w-5 text-primary" />
          Data Management
        </h3>
        
        <div className="space-y-3">
          {/* Export Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportJSON}
          >
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleImportClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import from JSON
          </Button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setIsResetDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Reset All Data
          </Button>
        </div>

        {/* Helper Text */}
        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Export your biodata as JSON to save a backup or share it across devices. You can import it later to restore your data.
          </p>
        </div>
      </div>

      {/* Import Confirmation/Error Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importError ? (
                <>
                  <FileWarning className="h-5 w-5 text-destructive" />
                  Import Error
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Confirm Import
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {importError ? (
                <span className="text-destructive">{importError}</span>
              ) : (
                "Review the details below before importing. This will replace your current biodata."
              )}
            </DialogDescription>
          </DialogHeader>

          {!importError && importPreview && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{importPreview.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="font-medium">{importPreview.sections}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exported:</span>
                  <span className="font-medium">{importPreview.exportedAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{importPreview.version}</span>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-500/10 p-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">
                  Importing will replace all your current data. Make sure to export your current biodata first if you want to keep it.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseImportDialog}>
              Cancel
            </Button>
            {!importError && (
              <Button onClick={handleConfirmImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Reset All Data?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your biodata will be permanently deleted and reset to default values.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>What will be reset:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• All personal information</li>
              <li>• Education and family details</li>
              <li>• Contact information</li>
              <li>• Custom sections and fields</li>
              <li>• Template and background selections</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReset}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataManagement;
