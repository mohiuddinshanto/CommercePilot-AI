"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useConversations, useDeleteConversation } from "../hooks/useAi";
import { formatDate } from "@/lib/utils";

export function ConversationSidebar() {
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { data, isLoading } = useConversations(page, 20);
  const deleteMutation = useDeleteConversation();

  const conversations = data?.items || [];
  const total = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          if (window.location.pathname.includes(id)) {
            router.push("/ai");
          }
        },
      });
    }
  };

  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-gray-200 bg-gray-50 py-4">
        <button
          onClick={() => setCollapsed(false)}
          className="mb-4 rounded-lg p-2 text-gray-500 hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => router.push("/ai")}
          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Conversations</h3>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => router.push("/ai")}
        className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="space-y-2 px-2 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-gray-400">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => router.push(`/ai/${conv.id}`)}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-200"
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-gray-900">{conv.title}</p>
                <p className="text-xs text-gray-400">{formatDate(conv.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                className="hidden shrink-0 rounded p-1 text-gray-400 hover:bg-gray-300 hover:text-red-600 group-hover:block"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs text-gray-400">
            {page}/{totalPages} ({total})
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
