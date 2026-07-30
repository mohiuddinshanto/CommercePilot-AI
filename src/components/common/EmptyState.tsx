"use client";

import { useT } from "@/lib/i18n/use-t";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  message,
  icon: Icon = Inbox,
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const T = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Icon className="h-12 w-12 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900">{title ?? T("common.noDataFound", "No data found")}</h3>
      <p className="text-sm text-gray-500">{message ?? T("common.nothingToDisplay", "There is nothing to display yet.")}</p>
    </div>
  );
}
