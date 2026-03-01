"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h2 className="text-3xl font-heading font-bold text-dark mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We apologize for the inconvenience. Our team has been notified of this
          issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Try again
          </button>
          <Link href="/" className="btn-outline flex items-center justify-center">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
