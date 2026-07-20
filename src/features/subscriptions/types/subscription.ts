export type SubscriptionPlan = "starter" | "pro" | "business";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trialing";
export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionLimits {
  maxProducts: number;
  maxCategories: number;
  maxInventory: number;
  maxStaff: number;
  maxAiRequests: number;
}

export interface SubscriptionUsage {
  products: number;
  categories: number;
  inventory: number;
  staff: number;
  aiRequests: number;
  lastResetAt: string;
}

export interface SubscriptionDocument {
  _id: string;
  storeId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  startedAt: string;
  expiresAt: string;
  renewalDate: string;
  cancelledAt?: string;
  isTrial: boolean;
  trialEndsAt?: string;
  features: string[];
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionInput {
  plan: SubscriptionPlan;
  billingCycle?: BillingCycle;
}

export interface UpgradePlanInput {
  plan: SubscriptionPlan;
  billingCycle?: BillingCycle;
}

export interface BillingRecord {
  id: string;
  storeId: string;
  subscriptionId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  billingCycle: BillingCycle;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export const PLAN_PRICES: Record<SubscriptionPlan, Record<BillingCycle, number>> = {
  starter: { monthly: 0, yearly: 0 },
  pro: { monthly: 29.99, yearly: 299.99 },
  business: { monthly: 79.99, yearly: 799.99 },
};

export const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  starter: [
    "1 store",
    "Up to 5 staff",
    "100 products",
    "10 categories",
    "500 inventory items",
    "50 AI requests/month",
    "Basic reporting",
    "Community support",
  ],
  pro: [
    "1 store",
    "Up to 25 staff",
    "5,000 products",
    "Unlimited categories",
    "Unlimited inventory",
    "500 AI requests/month",
    "Advanced reporting & analytics",
    "Priority support",
    "Sales tracking",
    "Bundle management",
  ],
  business: [
    "Unlimited stores",
    "Unlimited staff",
    "Unlimited products",
    "Unlimited categories",
    "Unlimited inventory",
    "Unlimited AI requests",
    "Full analytics suite",
    "Dedicated support",
    "Custom integrations",
    "Priority onboarding",
    "Advanced security",
    "API access",
  ],
};

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  pro: "Professional",
  business: "Business",
};

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  expired: "Expired",
  trialing: "Trial",
};
