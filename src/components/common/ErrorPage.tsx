"use client";

import { useT } from "@/lib/i18n/use-t";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function ErrorPage({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const T = useT();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <AlertTriangle className="h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-bold text-gray-900">{title ?? T("common.somethingWentWrong", "Something went wrong")}</h1>
      <p className="text-center text-gray-600">{message ?? T("common.unexpectedError", "An unexpected error occurred.")}</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {T("common.backToDashboard", "Back to Dashboard")}
      </Link>
    </div>
  );
}
