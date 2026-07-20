"use client";

import { AIChat } from "@/features/ai/components/AIChat";
import { ConversationSidebar } from "@/features/ai/components/ConversationSidebar";

export default function AIPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ConversationSidebar />
      <div className="flex flex-1 flex-col">
        <AIChat />
      </div>
    </div>
  );
}
