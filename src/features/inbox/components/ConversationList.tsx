"use client";

import { useConversations, useConnections, useMarkConversationRead } from "../hooks/useInbox";
import type { InboxConversation } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { Search, MessageSquare } from "lucide-react";

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (conversation: InboxConversation) => void;
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { data, isLoading } = useConversations({ limit: 100 });
  const { data: connections } = useConnections();
  const markRead = useMarkConversationRead();

  const conversations = data?.items ?? [];

  const connectionName = (connectionId: string) => {
    const conn = connections?.find((c) => c._id === connectionId);
    return conn?.pageName ?? "";
  };

  const handleSelect = (conversation: InboxConversation) => {
    onSelect(conversation);
    if (conversation.unreadCount > 0) {
      markRead.mutate(conversation._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-gray-400">Loading conversations...</div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <MessageSquare className="h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">No conversations yet.</p>
        <p className="text-xs text-gray-400">
          When a customer messages your connected page, the chat will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
        {conversations.map((conversation) => {
          const isSelected = conversation._id === selectedId;
          return (
            <button
              key={conversation._id}
              onClick={() => handleSelect(conversation)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                isSelected && "bg-blue-50 hover:bg-blue-50"
              )}
            >
              <div className="relative shrink-0">
                {conversation.participantProfilePic ? (
                  <img
                    src={conversation.participantProfilePic}
                    alt={conversation.participantName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {conversation.participantName.charAt(0).toUpperCase()}
                  </div>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {conversation.participantName}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-gray-500">{conversation.lastMessagePreview || "..."}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    {connectionName(conversation.connectionId)}
                  </span>
                  {conversation.assignedToName && (
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-700">
                      {conversation.assignedToName}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
