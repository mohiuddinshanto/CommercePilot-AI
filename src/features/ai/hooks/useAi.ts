"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendChatMessage,
  getConversations,
  getConversation,
  deleteConversation,
} from "../api/ai.api";
import type { ChatRequest } from "@/types/ai";

export function useChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatRequest) => sendChatMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
      if (variables.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["ai", "conversation", variables.conversationId],
        });
      }
    },
  });
}

export function useConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["ai", "conversations", page, limit],
    queryFn: () => getConversations(page, limit),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["ai", "conversation", id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
    },
  });
}
