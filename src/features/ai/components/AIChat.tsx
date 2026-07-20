"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "../hooks/useAi";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedPrompts } from "./SuggestedPrompts";
import type { AIMessage } from "@/types/ai";

interface AIChatProps {
  conversationId?: string;
  initialMessages?: AIMessage[];
  initialTitle?: string;
  model?: string;
}

export function AIChat({ conversationId: initialConvId, initialMessages = [], model }: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConvId);
  const [selectedModel, setSelectedModel] = useState(model || "llama-3.1-8b-instant");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChat();
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (message: string) => {
    const userMessage: AIMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    chatMutation.mutate(
      { message, conversationId, model: selectedModel },
      {
        onSuccess: (data) => {
          const assistantMessage: AIMessage = { role: "assistant", content: data.assistantMessage.content };
          setMessages((prev) => [...prev, assistantMessage]);

          if (!conversationId) {
            setConversationId(data.conversationId);
            router.push(`/ai/${data.conversationId}`, { scroll: false });
          }
        },
        onError: (error) => {
          const errorMessage: AIMessage = {
            role: "assistant",
            content: `Error: ${error.message || "Failed to get AI response. Please try again."}`,
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const showWelcome = messages.length === 0 && !chatMutation.isPending;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="llama-3.1-8b-instant">Llama 3.1 8B (Fast)</option>
            <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Versatile)</option>
            <option value="llama3-70b-8192">Llama 3 70B</option>
          </select>
        </div>
        {conversationId && (
          <button
            onClick={() => router.push("/ai")}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            New Chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {showWelcome ? (
          <SuggestedPrompts onSelect={handleSend} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages
              .filter((m) => m.role !== "system")
              .map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
                <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} isLoading={chatMutation.isPending} />
    </div>
  );
}
