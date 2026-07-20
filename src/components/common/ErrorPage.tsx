"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <AlertTriangle className="h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-center text-gray-600">{message}</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
