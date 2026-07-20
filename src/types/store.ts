export interface Store {
  _id: string;
  ownerId: string;
  storeName: string;
  storeSlug: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  currency: string;
  timezone: string;
  plan: "starter" | "pro" | "business";
  accountStatus: "pending" | "approved" | "rejected" | "suspended";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
