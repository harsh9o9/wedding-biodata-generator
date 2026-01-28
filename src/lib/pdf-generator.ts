"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Biodata, BiodataSection } from "@/types/biodata";

/**
 * A4 dimensions in mm
 */
const A4 = {
  width: 210,
  height: 297,
};

/**
 * Safely get sections array with fallback to empty array
 */
function getSafeSections(biodata: Biodata): BiodataSection[] {
  if (!biodata || !biodata.sections || !Array.isArray(biodata.sections)) {
    return [];
  }
  return biodata.sections;
}

/**
 * Get person's name from biodata
 */
function getPersonName(biodata: Biodata): string {
  const sections = getSafeSections(biodata);
  const personalSection = sections.find((s) => s && s.id === "personal");
  if (!personalSection || !personalSection.fields || !Array.isArray(personalSection.fields)) {
    return "Your Name";
  }
  const nameField = personalSection.fields.find((f) => f && f.id === "name");
  return nameField?.value || "Your Name";
}

/**
 * Options for PDF generation
 */
export interface PDFGenerationOptions {
  /** The HTML element to capture */
  element: HTMLElement;
  /** Scale factor for resolution (default: 2 for good quality) */
  scale?: number;
  /** Whether to include background (default: true) */
  includeBackground?: boolean;
  /** JPEG quality 0-1 (default: 0.92 for good balance of quality/size) */
  quality?: number;
}

/**
 * Generate PDF blob from HTML element using html2canvas + jsPDF
 * This approach captures the preview exactly as it appears on screen
 * Uses JPEG compression for smaller file sizes (~200-500KB instead of 7-8MB)
 */
export async function generatePDF(
  biodata: Biodata,
  options: PDFGenerationOptions
): Promise<Blob> {
  const { element, scale = 2, includeBackground = true, quality = 0.92 } = options;

  if (!element) {
    throw new Error("No element provided for PDF generation");
  }

  console.log("=== PDF Generation Debug (jsPDF + html2canvas) ===");
  console.log("1. Element:", element.tagName, element.className);
  console.log("2. Element dimensions:", element.offsetWidth, "x", element.offsetHeight);
  console.log("3. Scale:", scale, "| Quality:", quality);

  try {
    // Capture the element as a canvas with high resolution
    console.log("4. Starting html2canvas capture...");
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: includeBackground ? null : "#ffffff",
      logging: false,
      // Ensure we capture the full element
      width: element.offsetWidth,
      height: element.offsetHeight,
      // Better image quality
      imageTimeout: 15000,
    });

    console.log("5. Canvas captured:", canvas.width, "x", canvas.height);

    // Calculate dimensions to fit A4 while maintaining aspect ratio
    const imgWidth = A4.width;
    const imgHeight = (canvas.height * A4.width) / canvas.width;

    // Create PDF with A4 size
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true, // Enable compression
    });

    console.log("6. PDF created, adding image...");

    // Convert canvas to JPEG with compression (much smaller than PNG)
    // JPEG quality: 0.92 gives excellent quality at ~10-20x smaller file size than PNG
    const imgData = canvas.toDataURL("image/jpeg", quality);

    // If the content is taller than one page, we need to handle pagination
    if (imgHeight > A4.height) {
      // Scale down to fit on one page
      const scaledHeight = A4.height;
      const scaledWidth = (canvas.width * A4.height) / canvas.height;
      const xOffset = (A4.width - scaledWidth) / 2; // Center horizontally

      pdf.addImage(imgData, "JPEG", xOffset, 0, scaledWidth, scaledHeight, undefined, "FAST");
      console.log("7. Image scaled to fit page:", scaledWidth, "x", scaledHeight);
    } else {
      // Content fits on one page, center it
      const yOffset = (A4.height - imgHeight) / 2;
      pdf.addImage(imgData, "JPEG", 0, yOffset, imgWidth, imgHeight, undefined, "FAST");
      console.log("7. Image added centered:", imgWidth, "x", imgHeight);
    }

    console.log("8. Generating blob...");
    const blob = pdf.output("blob");
    const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (blob.size / 1024).toFixed(0);
    console.log(`9. PDF generated successfully! Size: ${sizeKB} KB (${sizeMB} MB)`);

    return blob;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Download PDF to user's device
 */
export async function downloadPDF(
  biodata: Biodata,
  options: PDFGenerationOptions
): Promise<void> {
  const blob = await generatePDF(biodata, options);
  const personName = getPersonName(biodata);

  // Create filename
  const safeName = personName.replace(/[^a-zA-Z0-9]/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const filename = `biodata_${safeName}_${date}.pdf`;

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  const sizeKB = (blob.size / 1024).toFixed(0);
  console.log(`10. PDF downloaded: ${filename} (${sizeKB} KB)`);
}

/**
 * Generate PDF and return as base64 string (useful for previewing or sending)
 */
export async function generatePDFBase64(
  biodata: Biodata,
  options: PDFGenerationOptions
): Promise<string> {
  const { element, scale = 2, includeBackground = true, quality = 0.92 } = options;

  if (!element) {
    throw new Error("No element provided for PDF generation");
  }

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: includeBackground ? null : "#ffffff",
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
    imageTimeout: 15000,
  });

  const imgWidth = A4.width;
  const imgHeight = (canvas.height * A4.width) / canvas.width;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", quality);

  if (imgHeight > A4.height) {
    const scaledHeight = A4.height;
    const scaledWidth = (canvas.width * A4.height) / canvas.height;
    const xOffset = (A4.width - scaledWidth) / 2;
    pdf.addImage(imgData, "JPEG", xOffset, 0, scaledWidth, scaledHeight, undefined, "FAST");
  } else {
    const yOffset = (A4.height - imgHeight) / 2;
    pdf.addImage(imgData, "JPEG", 0, yOffset, imgWidth, imgHeight, undefined, "FAST");
  }

  return pdf.output("datauristring");
}

const pdfGenerator = {
  generatePDF,
  downloadPDF,
  generatePDFBase64,
};

export default pdfGenerator;
