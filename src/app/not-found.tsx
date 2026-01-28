import Link from "next/link";
import { FileQuestion, Home, PenLine } from "lucide-react";

/**
 * Custom 404 Not Found Page
 * Displayed when a user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-50 to-cream-100 p-4">
      <div className="w-full max-w-md text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-saffron-100">
              <FileQuestion className="h-16 w-16 text-saffron-600" />
            </div>
            {/* Decorative rings */}
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-saffron-300 opacity-20" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="mb-2 font-serif text-7xl font-bold text-maroon-800">404</h1>

        {/* Error Message */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
          Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-saffron-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <Link
            href="/editor"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-maroon-300 bg-white px-6 py-3 font-semibold text-maroon-700 transition-colors hover:bg-maroon-50 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2"
          >
            <PenLine className="h-5 w-5" />
            Create Biodata
          </Link>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gold-400" />
            <span className="text-2xl text-gold-500">✦</span>
            <span className="h-px w-12 bg-gold-400" />
          </div>
          <p className="font-serif text-lg text-maroon-600">
            Indian Wedding Biodata Generator
          </p>
        </div>
      </div>
    </div>
  );
}
