import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  SocialConnection,
  CreateConnectionInput,
  UpdateConnectionInput,
  InboxConversation,
  UpdateConversationInput,
  InboxMessage,
  MessagesResult,
  ReplyActivityItem,
  ConversationQueryParams,
} from "@/types/inbox";
import type { PaginatedData } from "@/types/api";

const BASE = API_ENDPOINTS.V1.INBOX;

export async function getConnections(): Promise<SocialConnection[]> {
  return get<SocialConnection[]>(`${BASE}/connections`);
}

export async function connectPage(input: CreateConnectionInput): Promise<SocialConnection> {
  return post<SocialConnection>(`${BASE}/connections`, input);
}

export async function updateConnection(
  id: string,
  input: UpdateConnectionInput
): Promise<SocialConnection> {
  return patch<SocialConnection>(`${BASE}/connections/${id}`, input);
}

export async function disconnectPage(id: string): Promise<void> {
  return del<void>(`${BASE}/connections/${id}`);
}

export async function getConversations(
  params: ConversationQueryParams = {}
): Promise<PaginatedData<InboxConversation>> {
  const query = buildQueryString(params);
  return get<PaginatedData<InboxConversation>>(`${BASE}/conversations${query}`);
}

export async function getConversationMessages(
  id: string,
  params: { page?: number; limit?: number } = {}
): Promise<MessagesResult> {
  const query = buildQueryString(params);
  return get<MessagesResult>(`${BASE}/conversations/${id}/messages${query}`);
}

export async function sendMessage(id: string, text: string): Promise<InboxMessage> {
  return post<InboxMessage>(`${BASE}/conversations/${id}/messages`, { text });
}

export async function updateConversation(
  id: string,
  input: UpdateConversationInput
): Promise<InboxConversation> {
  return patch<InboxConversation>(`${BASE}/conversations/${id}`, input);
}

export async function markConversationRead(id: string): Promise<void> {
  return post<void>(`${BASE}/conversations/${id}/read`);
}

export async function getReplyActivity(
  params: { page?: number; limit?: number; connectionId?: string } = {}
): Promise<PaginatedData<ReplyActivityItem>> {
  const query = buildQueryString(params);
  return get<PaginatedData<ReplyActivityItem>>(`${BASE}/activity${query}`);
}
