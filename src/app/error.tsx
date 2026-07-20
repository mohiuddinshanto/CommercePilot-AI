"use client";

import { ErrorPage } from "@/components/common/ErrorPage";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ErrorPage
          title="Application Error"
          message={error.message || "An unexpected error occurred."}
        />
        <div className="flex justify-center pb-4">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
