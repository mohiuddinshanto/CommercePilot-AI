"use client";

import { AIChat } from "@/features/ai/components/AIChat";
import { ConversationSidebar } from "@/features/ai/components/ConversationSidebar";
import { useT } from "@/lib/i18n/use-t";

export default function AIPage() {
  const T = useT();
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-gray-200 bg-white" aria-label={T("ai.title")}>
      <ConversationSidebar />
      <div className="flex flex-1 flex-col">
        <AIChat />
      </div>
    </div>
  );
}
