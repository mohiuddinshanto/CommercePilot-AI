"use client";

import { useReplyActivity } from "../hooks/useInbox";
import { EmptyState } from "@/components/common/EmptyState";
import { Activity, MessageCircle } from "lucide-react";

export function ActivityLog() {
  const { data, isLoading } = useReplyActivity({ limit: 100 });

  if (isLoading) {
    return <p className="p-6 text-center text-sm text-gray-400">Loading activity...</p>;
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        message="When a moderator replies to a customer, it will be logged here with who and when."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Reply Activity</h3>
        <p className="text-xs text-gray-500">Who replied to which customer and when.</p>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item._id} className="flex items-start gap-3 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{item.repliedByName}</span>
                <span className="text-gray-500"> replied to </span>
                <span className="font-medium">{item.participantName}</span>
              </p>
              <p className="mt-0.5 text-sm text-gray-500">{item.text}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
