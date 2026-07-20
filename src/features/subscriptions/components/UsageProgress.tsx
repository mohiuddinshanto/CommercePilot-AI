"use client";

import { cn } from "@/lib/utils";

interface UsageProgressProps {
  label: string;
  used: number;
  max: number;
  unit?: string;
}

export function UsageProgress({ label, used, max, unit = "" }: UsageProgressProps) {
  const isUnlimited = max === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
  const isWarning = !isUnlimited && percentage >= 80;
  const isDanger = !isUnlimited && percentage >= 95;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {used.toLocaleString()} / {isUnlimited ? "Unlimited" : max.toLocaleString()}
          {unit && ` ${unit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isDanger
                ? "bg-red-500"
                : isWarning
                ? "bg-yellow-500"
                : "bg-blue-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
