"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConnections,
  connectPage,
  updateConnection,
  disconnectPage,
  getConversations,
  getConversationMessages,
  sendMessage,
  updateConversation,
  markConversationRead,
  getReplyActivity,
} from "../api/inbox.api";
import type {
  CreateConnectionInput,
  UpdateConnectionInput,
  UpdateConversationInput,
  ConversationQueryParams,
} from "@/types/inbox";

export function useConnections() {
  return useQuery({
    queryKey: ["inbox", "connections"],
    queryFn: () => getConnections(),
  });
}

export function useConnectPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateConnectionInput) => connectPage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "connections"] });
    },
  });
}

export function useUpdateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateConnectionInput }) =>
      updateConnection(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "connections"] });
    },
  });
}

export function useDisconnectPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disconnectPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "connections"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
    },
  });
}

export function useConversations(params: ConversationQueryParams = {}) {
  return useQuery({
    queryKey: ["inbox", "conversations", params],
    queryFn: () => getConversations(params),
  });
}

export function useConversationMessages(id: string) {
  return useQuery({
    queryKey: ["inbox", "messages", id],
    queryFn: () => getConversationMessages(id),
    enabled: !!id,
    refetchInterval: 15000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => sendMessage(id, text),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "messages", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "activity"] });
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateConversationInput }) =>
      updateConversation(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "messages"] });
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markConversationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
    },
  });
}

export function useReplyActivity(params: { page?: number; limit?: number; connectionId?: string } = {}) {
  return useQuery({
    queryKey: ["inbox", "activity", params],
    queryFn: () => getReplyActivity(params),
  });
}
