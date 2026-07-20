import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  ShoppingCart,
  RotateCcw,
  Users,
  BarChart3,
  LineChart,
  Sparkles,
  Settings,
  Shield,
} from "lucide-react";
import { ROLES, type Role } from "./roles";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    permission: "products",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
    permission: "products",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Warehouse,
    permission: "inventory",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    permission: "sales",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Returns",
    href: "/returns",
    icon: RotateCcw,
    permission: "sales",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Staff",
    href: "/staff",
    icon: Users,
    permission: "staff",
    roles: [ROLES.OWNER],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    permission: "reports",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: LineChart,
    permission: "analytics",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "AI Copilot",
    href: "/ai",
    icon: Sparkles,
    permission: "ai",
    roles: [ROLES.OWNER, ROLES.STAFF],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    permission: "settings",
    roles: [ROLES.OWNER],
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: [ROLES.SUPER_ADMIN],
  },
];
