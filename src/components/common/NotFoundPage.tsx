"use client";

import { useT } from "@/lib/i18n/use-t";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export function NotFoundPage() {
  const T = useT();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <FileQuestion className="h-16 w-16 text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-900">{T("common.pageNotFound", "Page Not Found")}</h1>
      <p className="text-center text-gray-600">
        {T("common.pageNotFoundDesc", "The page you are looking for does not exist or has been moved.")}
      </p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {T("common.backToDashboard", "Back to Dashboard")}
      </Link>
    </div>
  );
}
