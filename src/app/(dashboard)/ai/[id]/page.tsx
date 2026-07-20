"use client";

import { useParams } from "next/navigation";
import { AIChat } from "@/features/ai/components/AIChat";
import { ConversationSidebar } from "@/features/ai/components/ConversationSidebar";
import { useConversation } from "@/features/ai/hooks/useAi";
import { ErrorPage } from "@/components/common/ErrorPage";

export default function AIConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { data: conversation, isLoading, error } = useConversation(conversationId);

  if (error) {
    return <ErrorPage title="Conversation not found" message="This conversation may have been deleted." />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ConversationSidebar />
      <div className="flex flex-1 flex-col">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : conversation ? (
          <AIChat
            conversationId={conversation.id}
            initialMessages={conversation.messages}
            initialTitle={conversation.title}
            model={conversation.model}
          />
        ) : null}
      </div>
    </div>
  );
}
