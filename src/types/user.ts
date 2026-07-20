export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: "super_admin" | "owner" | "staff";
  storeId?: string;
  accountStatus: "pending" | "approved" | "rejected" | "suspended";
  plan?: "starter" | "pro" | "business";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
    createdAt: string;
  };
}
