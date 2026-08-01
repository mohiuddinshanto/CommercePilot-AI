export const STAFF_PERMISSIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  INVENTORY: "inventory",
  SALES: "sales",
  REPORTS: "reports",
  ANALYTICS: "analytics",
  STAFF: "staff",
  SETTINGS: "settings",
  AI: "ai",
  INBOX: "inbox",
} as const;

export type Permission = (typeof STAFF_PERMISSIONS)[keyof typeof STAFF_PERMISSIONS];
