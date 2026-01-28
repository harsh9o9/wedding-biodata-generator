import { Loader2 } from "lucide-react";

/**
 * Loading state for the main landing page
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-50 to-cream-100">
      {/* Loading animation */}
      <div className="relative mb-8">
        {/* Decorative ring */}
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-saffron-300 opacity-20" />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-saffron-100">
          <Loader2 className="h-10 w-10 animate-spin text-saffron-600" />
        </div>
      </div>

      {/* Loading text */}
      <h2 className="mb-2 font-serif text-xl font-semibold text-maroon-800">
        Loading...
      </h2>
      <p className="text-sm text-gray-600">Preparing your biodata generator</p>

      {/* Decorative element */}
      <div className="mt-8 flex items-center gap-3">
        <span className="h-px w-8 bg-gold-400" />
        <span className="text-lg text-gold-500">✦</span>
        <span className="h-px w-8 bg-gold-400" />
      </div>
    </div>
  );
}
