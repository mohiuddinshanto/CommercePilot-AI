import { get, post, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  ChatRequest,
  ChatResponse,
  ConversationListItem,
  ConversationDetail,
  GenerateContentRequest,
  GenerateContentResponse,
} from "@/types/ai";
import { getStoredToken } from "@/lib/token";

export async function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  return post<ChatResponse>(`${API_ENDPOINTS.V1.AI}/chat`, data);
}

export async function generateContent(data: GenerateContentRequest): Promise<GenerateContentResponse> {
  return post<GenerateContentResponse>(`${API_ENDPOINTS.V1.AI}/generate`, data);
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

export async function sendChatMessageStream(data: ChatRequest, onToken: (token: string) => void, onDone: (conversationId: string) => void): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${baseUrl}${API_ENDPOINTS.V1.AI}/chat/stream`, { method: "POST", credentials: "include", headers, body: JSON.stringify(data) });
  if (!response.ok || !response.body) throw new Error("Unable to start AI stream.");
  const reader = response.body.getReader(); const decoder = new TextDecoder(); let pending = "";
  while (true) { const { done, value } = await reader.read(); pending += decoder.decode(value || new Uint8Array(), { stream: !done }); const events = pending.split("\n\n"); pending = events.pop() || ""; for (const event of events) { const raw = event.split("\n").find((line) => line.startsWith("data: "))?.slice(6); if (!raw) continue; const payload = JSON.parse(raw) as { type: string; content?: string; conversationId?: string; message?: string }; if (payload.type === "token") onToken(payload.content || ""); if (payload.type === "done") onDone(payload.conversationId || ""); if (payload.type === "error") throw new Error(payload.message || "AI stream failed."); } if (done) break; }
}
