export interface SocialConnection {
  _id: string;
  storeId: string;
  platform: string;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  active: boolean;
  connectedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateConnectionInput {
  platform: string;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
}

export interface UpdateConnectionInput {
  pageName?: string;
  pageAccessToken?: string;
  active?: boolean;
}

export interface InboxConversation {
  _id: string;
  storeId: string;
  connectionId: string;
  platform: string;
  participantId: string;
  participantName: string;
  participantProfilePic?: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  lastMessageDirection: string;
  unreadCount: number;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface UpdateConversationInput {
  status?: string;
  assignedTo?: string | null;
}

export interface InboxMessage {
  _id: string;
  storeId: string;
  connectionId: string;
  conversationId: string;
  platform: string;
  direction: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: string;
  metaMessageId?: string;
  repliedBy?: string;
  repliedByName?: string;
  createdAt: string;
}

export interface ConversationDetail {
  _id: string;
  participantName: string;
  participantProfilePic?: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  connectionId: string;
}

export interface MessagesResult {
  items: InboxMessage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  conversation: ConversationDetail;
}

export interface ReplyActivityItem {
  _id: string;
  participantName: string;
  text: string;
  repliedByName: string;
  createdAt: string;
}

export interface ConversationQueryParams {
  page?: number;
  limit?: number;
  connectionId?: string;
  status?: string;
  q?: string;
}
