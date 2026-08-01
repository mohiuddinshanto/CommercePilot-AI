"use client";

import { useEffect, useRef, useState } from "react";
import {
  useConversationMessages,
  useSendMessage,
  useUpdateConversation,
} from "../hooks/useInbox";
import { useStaffList } from "@/features/staff/hooks/useStaff";
import { useAuth } from "@/providers/auth-provider";
import { useT } from "@/lib/i18n/use-t";
import type { InboxConversation } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { Send, CheckCheck, Inbox as InboxIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ChatWindowProps {
  conversation: InboxConversation | null;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const T = useT();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useConversationMessages(conversation?._id ?? "");
  const sendMessage = useSendMessage();
  const updateConversation = useUpdateConversation();
  const { data: staffData } = useStaffList({ limit: 100, status: "active" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.items.length]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center">
        <InboxIcon className="h-12 w-12 text-gray-300" />
        <p className="text-sm text-gray-500">{T("inbox.selectConversation")}</p>
      </div>
    );
  }

  const messages = data?.items ?? [];
  const detail = data?.conversation;

  const assigneeOptions = [
    { id: user?.id ?? "", name: user?.name ?? "Me" },
    ...(staffData?.items ?? [])
      .filter((s) => s.status === "active")
      .map((s) => ({ id: s.userId, name: s.name })),
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      await sendMessage.mutateAsync({ id: conversation._id, text: trimmed });
      setText("");
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          {conversation.participantProfilePic ? (
            <img
              src={conversation.participantProfilePic}
              alt={conversation.participantName}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {conversation.participantName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{conversation.participantName}</h3>
            <p className="text-xs text-gray-400">Facebook Messenger</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={detail?.assignedTo ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              updateConversation.mutate({
                id: conversation._id,
                input: { assignedTo: value || null },
              });
            }}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">{T("inbox.assign")}</option>
            {assigneeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>

          <button
            onClick={() =>
              updateConversation.mutate({
                id: conversation._id,
                input: { status: detail?.status === "open" ? "closed" : "open" },
              })
            }
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              detail?.status === "open"
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {detail?.status === "open" ? T("inbox.close") : T("inbox.reopen")}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        {isLoading && messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">Loading messages...</p>
        )}

        {messages.map((msg) => {
          const isOutbound = msg.direction === "outbound";
          return (
            <div key={msg._id} className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2",
                  isOutbound ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow-sm border border-gray-100"
                )}
              >
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                {msg.attachmentUrl && (
                  <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs underline">
                    {msg.attachmentType || "Attachment"}
                  </a>
                )}
                <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", isOutbound ? "text-blue-100" : "text-gray-400")}>
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {isOutbound && <CheckCheck className="h-3 w-3" />}
                </div>
                {isOutbound && msg.repliedByName && (
                  <p className={cn("text-[10px]", isOutbound ? "text-blue-100" : "text-gray-400")}>
                    by {msg.repliedByName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={T("inbox.typeMessage")}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sendMessage.isPending || !text.trim()}
            className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
