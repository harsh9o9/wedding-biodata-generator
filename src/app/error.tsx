"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Global Error Boundary Component
 * Catches and displays errors at the application level
 * Provides user-friendly error messages and recovery options
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-maroon-200 bg-white p-8 shadow-xl">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-maroon-100">
                <AlertTriangle className="h-10 w-10 text-maroon-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="mb-2 text-center text-2xl font-bold text-maroon-900">
              Something went wrong!
            </h1>
            <p className="mb-6 text-center text-gray-600">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 rounded-lg bg-gray-100 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-700">Error details:</p>
                <p className="break-all font-mono text-xs text-gray-600">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 font-mono text-xs text-gray-500">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
              >
                <RefreshCcw className="h-5 w-5" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-maroon-300 bg-white px-4 py-3 font-semibold text-maroon-700 transition-colors hover:bg-maroon-50 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2"
              >
                <Home className="h-5 w-5" />
                Go to Homepage
              </Link>
            </div>

            {/* Support Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              If this problem persists, please{" "}
              <a
                href="https://github.com/yourusername/biodata-generator/issues"
                className="text-saffron-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                report an issue
              </a>
              .
            </p>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <p className="font-serif text-2xl text-gold-600">॥ शुभम् भवतु ॥</p>
            <p className="mt-1 text-sm text-gray-500">May auspiciousness prevail</p>
          </div>
        </div>
      </body>
    </html>
  );
}
