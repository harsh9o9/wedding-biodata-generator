import { Loader2 } from "lucide-react";

/**
 * Loading state for the Editor page
 * Shows a skeleton UI while the editor is loading
 */
export default function EditorLoading() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation Bar Skeleton */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          <div className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden h-6 w-32 animate-pulse rounded bg-muted sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-full border-r border-border lg:w-[45%]">
          {/* Tabs Skeleton */}
          <div className="m-4 flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4 p-4">
            {/* Section */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-4 h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Another Section */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden flex-1 flex-col gap-4 bg-muted/30 p-4 lg:flex">
          {/* Zoom Controls Skeleton */}
          <div className="flex items-center justify-between rounded-lg bg-card p-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-9 w-32 animate-pulse rounded bg-muted" />
          </div>

          {/* Preview Area Skeleton */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className="animate-pulse rounded-lg bg-white shadow-lg"
                style={{ width: 420, height: 594 }}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-saffron-500" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading preview...
                  </p>
                </div>
              </div>
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
