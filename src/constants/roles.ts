export const ROLES = {
  SUPER_ADMIN: "super_admin",
  OWNER: "owner",
  STAFF: "staff",
} as const;

export const STAFF_ROLES = {
  MANAGER: "manager",
  CASHIER: "cashier",
  INVENTORY_MANAGER: "inventory_manager",
  SALES_MANAGER: "sales_manager",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type StaffRole = (typeof STAFF_ROLES)[keyof typeof STAFF_ROLES];
