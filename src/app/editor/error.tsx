"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home, Trash2 } from "lucide-react";
import Link from "next/link";
import { STORAGE_KEYS } from "@/constants/theme";

/**
 * Editor-specific Error Boundary
 * Handles errors in the editor page with options to clear data
 */
export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging
    console.error("Editor error:", error);
  }, [error]);

  // Clear localStorage and reset
  const handleClearAndReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.biodata);
      localStorage.removeItem(STORAGE_KEYS.preferences);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
    reset();
  };

  // Determine if error might be data-related
  const isDataError =
    error.message.includes("localStorage") ||
    error.message.includes("JSON") ||
    error.message.includes("parse") ||
    error.message.includes("undefined") ||
    error.message.includes("null");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-50 to-cream-100 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-maroon-200 bg-white p-8 shadow-xl">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-2 text-center text-xl font-bold text-gray-900">
          Editor Error
        </h1>
        <p className="mb-4 text-center text-gray-600">
          {isDataError
            ? "There was a problem loading your biodata. This might be due to corrupted saved data."
            : "Something went wrong while loading the editor."}
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-gray-100 p-4">
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
              Error Message
            </p>
            <p className="break-all font-mono text-sm text-gray-700">
              {error.message}
            </p>
          </div>
        )}

        {/* Suggested Actions */}
        <div className="mb-6 rounded-lg bg-amber-50 p-4">
          <p className="mb-2 text-sm font-semibold text-amber-800">
            Suggested solutions:
          </p>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• Try refreshing the page</li>
            {isDataError && <li>• Clear your saved data and start fresh</li>}
            <li>• Clear your browser cache</li>
            <li>• Try using a different browser</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
          >
            <RefreshCcw className="h-5 w-5" />
            Try Again
          </button>

          {isDataError && (
            <button
              onClick={handleClearAndReset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="h-5 w-5" />
              Clear Data & Start Fresh
            </button>
          )}

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Back to Homepage
          </Link>
        </div>

        {/* Data Recovery Note */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> If you have previously exported your biodata as JSON,
            you can import it after clearing data to recover your information.
          </p>
        </div>
      </div>
    </div>
  );
}
