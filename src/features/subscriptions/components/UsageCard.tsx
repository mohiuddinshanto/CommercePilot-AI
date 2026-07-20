"use client";

import { UsageProgress } from "./UsageProgress";
import type { SubscriptionLimits, SubscriptionUsage } from "../types/subscription";
import {
  Package,
  Tags,
  Warehouse,
  Users,
  Sparkles,
} from "lucide-react";

interface UsageCardProps {
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
}

const USAGE_ITEMS = [
  {
    key: "products" as const,
    label: "Products",
    icon: Package,
    limitKey: "maxProducts" as const,
  },
  {
    key: "categories" as const,
    label: "Categories",
    icon: Tags,
    limitKey: "maxCategories" as const,
  },
  {
    key: "inventory" as const,
    label: "Inventory Items",
    icon: Warehouse,
    limitKey: "maxInventory" as const,
  },
  {
    key: "staff" as const,
    label: "Staff Members",
    icon: Users,
    limitKey: "maxStaff" as const,
  },
  {
    key: "aiRequests" as const,
    label: "AI Requests",
    icon: Sparkles,
    limitKey: "maxAiRequests" as const,
  },
];

export function UsageCard({ limits, usage }: UsageCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Usage Overview</h3>
      <div className="space-y-4">
        {USAGE_ITEMS.map((item) => (
          <UsageProgress
            key={item.key}
            label={item.label}
            used={usage[item.key] || 0}
            max={limits[item.limitKey]}
          />
        ))}
      </div>
    </div>
  );
}
