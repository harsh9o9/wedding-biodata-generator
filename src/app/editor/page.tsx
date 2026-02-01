"use client";

import React, { useState } from "react";
import { BiodataProvider } from "@/context/BiodataContext";
import { EditorLayout, TemplateSelector, BackgroundSelector, DownloadActions, DataManagement, ReligiousInvocationSelector } from "@/components/editor";
import { BiodataForm } from "@/components/form";
import { PreviewContainer } from "@/components/preview";
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Toaster } from "@/components/ui";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { ChevronLeft, FileCheck, Palette, FileText, Globe, Download } from "lucide-react";
import Link from "next/link";

/**
 * Editor Page - Main biodata editor with form and preview
 */
export default function EditorPage() {
  const [showHindiLabels, setShowHindiLabels] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  return (
    <BiodataProvider>
      <TooltipProvider delayDuration={300}>
        <div className="flex h-screen flex-col bg-background">
          {/* Top Navigation Bar */}
          <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="hidden h-6 w-px bg-border sm:block" />
              <h1 className="hidden font-semibold text-foreground sm:block">
                Biodata Editor
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant={showHindiLabels ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowHindiLabels(!showHindiLabels)}
                title={showHindiLabels ? "Hide Hindi labels" : "Show Hindi labels"}
              >
                <Globe className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {showHindiLabels ? "EN + हिंदी" : "English"}
                </span>
              </Button>
            </div>
          </header>

          {/* Main Editor Area */}
          <main className="flex-1 overflow-hidden">
            <EditorLayout
              formPanel={
                <FormPanelContent
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  showHindiLabels={showHindiLabels}
                />
              }
              previewPanel={<PreviewContainer className="h-full" />}
            />
          </main>

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </TooltipProvider>
    </BiodataProvider>
  );
}

/**
 * Form Panel Content - Tabbed interface for form, templates, and settings
 */
interface FormPanelContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showHindiLabels: boolean;
}

function FormPanelContent({
  activeTab,
  onTabChange,
  showHindiLabels,
}: FormPanelContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex h-full flex-col">
      {/* Tab Navigation */}
      <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
        <TabsTrigger value="form" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        <TabsTrigger value="design" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Design</span>
        </TabsTrigger>
        <TabsTrigger value="finalize" className="flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Finalize</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <TabsContent value="form" className="m-0 h-full">
          <BiodataForm
            showHindiLabels={showHindiLabels}
            className="h-full"
          />
        </TabsContent>

        <TabsContent value="design" className="m-0 p-4">
          <div className="space-y-6">
            <TemplateSelector />
            <BackgroundSelector />
          </div>
        </TabsContent>

        <TabsContent value="finalize" className="m-0 p-4">
          <SettingsPanel />
        </TabsContent>
      </div>
    </Tabs>
  );
}

/**
 * Settings Panel - Export/Import and other settings
 */
function SettingsPanel() {
  return (
    <div className="space-y-6">
      {/* Religious Invocation Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold text-foreground">Religious Invocation</h3>
        <ReligiousInvocationSelector />
      </div>

      {/* Download Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Download className="h-5 w-5 text-primary" />
          Download Biodata
        </h3>
        <DownloadActions />
      </div>

      {/* Photo Upload Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 font-semibold text-foreground">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
            <span className="text-center text-xs text-muted-foreground">
              Upload<br />Photo
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload a passport-size photo for your biodata. Recommended size: 400x500 pixels.
            </p>
            <Button variant="outline" size="sm">
              Choose Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management - Using new component */}
      <DataManagement />

      {/* Help Section */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="mb-2 font-semibold text-foreground">Need Help?</h3>
        <p className="text-sm text-muted-foreground">
          Fill in your details in the Content tab, customize the look in the Design tab,
          and download your biodata as a PDF when ready.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>• Click on section headers to expand/collapse</li>
          <li>• Hover over fields to see reorder options</li>
          <li>• Click the eye icon to show/hide fields</li>
          <li>• Changes are auto-saved to your browser</li>
          <li>• Use the Preview panel to see real-time updates</li>
        </ul>
      </div>
    </div>
  );
}
