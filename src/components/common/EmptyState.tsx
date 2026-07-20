"use client";

import { Inbox } from "lucide-react";

export function EmptyState({
  title = "No data found",
  message = "There is nothing to display yet.",
  icon: Icon = Inbox,
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Icon className="h-12 w-12 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
