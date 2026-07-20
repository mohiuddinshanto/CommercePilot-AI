export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
}

export interface ChatResponse {
  conversationId: string;
  userMessage: AIMessage;
  assistantMessage: AIMessage;
  model: string;
  tokensUsed: number;
  title: string;
}

export interface ConversationListItem {
  id: string;
  title: string;
  model: string;
  messageCount: number;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail {
  id: string;
  title: string;
  model: string;
  messages: AIMessage[];
  totalTokens: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export const AI_MODELS = [
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Fast)", description: "Quick responses, lower accuracy" },
  { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B (Versatile)", description: "Balanced speed and quality" },
  { id: "llama3-70b-8192", name: "Llama 3 70B", description: "High quality, slower" },
] as const;

export const SUGGESTED_PROMPTS = [
  "What are my top selling products this month?",
  "Analyze my inventory health and suggest improvements",
  "How is my sales performance compared to last month?",
  "Which products are at risk of going out of stock?",
  "Summarize my store's key metrics",
  "What are the busiest hours for my store?",
] as const;
