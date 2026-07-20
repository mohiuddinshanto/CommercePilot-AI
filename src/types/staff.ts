export interface StaffMember {
  _id: string;
  storeId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "pending" | "active" | "suspended";
  invitationToken: string;
  invitationExpiresAt: string;
  invitedBy: string;
  suspendedAt?: string;
  suspendedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteStaffInput {
  email: string;
  name: string;
  role?: string;
  permissions: string[];
}

export interface UpdateStaffInput {
  role?: string;
  permissions?: string[];
}

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
