import { get, post, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ChatRequest,
  ChatResponse,
  ConversationListItem,
  ConversationDetail,
} from "@/types/ai";

export async function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  return post<ChatResponse>(`${API_ENDPOINTS.V1.AI}/chat`, data);
}

export async function getConversations(
  page = 1,
  limit = 20
): Promise<{ items: ConversationListItem[]; pagination: { totalItems: number; totalPages: number; hasNext: boolean; hasPrevious: boolean } }> {
  return get<{ items: ConversationListItem[]; pagination: { totalItems: number; totalPages: number; hasNext: boolean; hasPrevious: boolean } }>(
    `${API_ENDPOINTS.V1.AI}/conversations?page=${page}&limit=${limit}`
  );
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  return get<ConversationDetail>(`${API_ENDPOINTS.V1.AI}/conversations/${id}`);
}

export async function deleteConversation(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.AI}/conversations/${id}`);
}
