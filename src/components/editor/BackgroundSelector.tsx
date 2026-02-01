"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { DEFAULT_BACKGROUNDS, FILE_LIMITS } from "@/constants/theme";
import { useBiodata } from "@/context/BiodataContext";
import { useToast } from "@/hooks";
import { BiodataBackground } from "@/types/biodata";
import { Check, Image as ImageIcon, Upload, Palette, X } from "lucide-react";
import { cn, compressImage } from "@/lib/utils";

interface BackgroundSelectorProps {
  className?: string;
  compact?: boolean;
}

/**
 * BackgroundSelector - Background selection with color, gradient, and image options
 */
export function BackgroundSelector({ className, compact = false }: BackgroundSelectorProps) {
  const { biodata, setBackground } = useBiodata();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customBgDialogOpen, setCustomBgDialogOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FFF9F0");
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; url: string }>
  >([]);

  const handleSelectBackground = useCallback(
    (bg: (typeof DEFAULT_BACKGROUNDS)[number]) => {
      const background: BiodataBackground = {
        type: bg.type,
        value: bg.value,
        opacity: 100,
      };
      setBackground(background);
    },
    [setBackground]
  );

  const handleCustomColor = useCallback(() => {
    const background: BiodataBackground = {
      type: "color",
      value: customColor,
      opacity: 100,
    };
    setBackground(background);
    setCustomBgDialogOpen(false);
  }, [customColor, setBackground]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > FILE_LIMITS.image) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      try {
        // Compress image to reduce localStorage usage
        const compressedUrl = await compressImage(file, 1200, 1600, 0.85);

        // Add to uploaded images
        const newImage = {
          id: `custom-${Date.now()}`,
          url: compressedUrl,
        };
        setUploadedImages((prev) => [...prev, newImage]);

        // Set as background
        const background: BiodataBackground = {
          type: "image",
          value: compressedUrl,
          opacity: 100,
        };
        setBackground(background);

        toast({
          title: "Background updated",
          description: "Your custom background has been applied",
        });
      } catch (error) {
        console.error("Failed to process image:", error);
        toast({
          title: "Failed to process image",
          description: "Please try a different image",
          variant: "destructive",
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setBackground, toast]
  );

  const handleRemoveCustomImage = useCallback(
    (imageId: string) => {
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
      
      // If the removed image was selected, reset to default
      const removedImage = uploadedImages.find((img) => img.id === imageId);
      if (removedImage && biodata.background.value === removedImage.url) {
        handleSelectBackground(DEFAULT_BACKGROUNDS[0]);
      }
    },
    [uploadedImages, biodata.background.value, handleSelectBackground]
  );

  const isSelected = useCallback(
    (bgValue: string) => {
      return biodata.background.value === bgValue;
    },
    [biodata.background.value]
  );

  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileUpload}
    />
  );

  // Compact view
  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        {fileInput}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Background</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {/* Default backgrounds */}
          {DEFAULT_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleSelectBackground(bg)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                isSelected(bg.value)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              title={bg.name}
            >
              {bg.type === "image" ? (
                <Image
                  src={bg.preview}
                  alt={bg.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: bg.preview }}
                />
              )}
              {isSelected(bg.value) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}

          {/* Custom color button */}
          <button
            onClick={() => setCustomBgDialogOpen(true)}
            className="relative flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-border transition-all hover:border-primary/50"
            title="Custom color"
          >
            <Palette className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Custom Color Dialog */}
        <Dialog open={customBgDialogOpen} onOpenChange={setCustomBgDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Custom Background Color</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-20 w-20 cursor-pointer rounded-lg border border-border"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#FFFFFF"
                  />
                  <div
                    className="h-10 rounded-md border border-border"
                    style={{ backgroundColor: customColor }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCustomBgDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomColor}>Apply Color</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Full view
  return (
    <Card className={className}>
      {fileInput}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-5 w-5 text-primary" />
          Background
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Backgrounds */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Colors</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_BACKGROUNDS.filter((bg) => bg.type === "color").map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelectBackground(bg)}
                className={cn(
                  "relative h-10 w-10 rounded-lg border-2 transition-all",
                  isSelected(bg.value)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
                title={bg.name}
              >
                <div
                  className="absolute inset-1 rounded"
                  style={{ backgroundColor: bg.preview }}
                />
                {isSelected(bg.value) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            ))}

            {/* Custom Color */}
            <button
              onClick={() => setCustomBgDialogOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-border transition-all hover:border-primary/50"
              title="Custom color"
            >
              <Palette className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Image Backgrounds */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Traditional Patterns
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEFAULT_BACKGROUNDS.filter((bg) => bg.type === "image").map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelectBackground(bg)}
                className={cn(
                  "relative aspect-3/4 overflow-hidden rounded-lg border-2 transition-all",
                  isSelected(bg.value)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
                title={bg.name}
              >
                <Image
                  src={bg.preview}
                  alt={bg.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 100px"
                />
                {isSelected(bg.value) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Uploaded Custom Images */}
        {uploadedImages.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Your Uploads
            </p>
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className={cn(
                    "group relative aspect-3/4 overflow-hidden rounded-lg border-2 transition-all",
                    isSelected(img.url)
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <button
                    onClick={() =>
                      setBackground({ type: "image", value: img.url, opacity: 100 })
                    }
                    className="h-full w-full"
                  >
                    <Image
                      src={img.url}
                      alt="Custom background"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 100px"
                    />
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveCustomImage(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {isSelected(img.url) && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4 text-foreground" />
          Upload Custom Background
        </Button>

        {/* Custom Color Dialog */}
        <Dialog open={customBgDialogOpen} onOpenChange={setCustomBgDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Custom Background Color</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-24 w-24 cursor-pointer rounded-lg border border-border"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    label="Hex Color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#FFFFFF"
                  />
                  <div
                    className="h-12 rounded-md border border-border"
                    style={{ backgroundColor: customColor }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCustomBgDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomColor}>Apply Color</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default BackgroundSelector;
