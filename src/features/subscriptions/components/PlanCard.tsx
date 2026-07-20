"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan, BillingCycle } from "../types/subscription";
import { PLAN_PRICES, PLAN_LABELS, PLAN_FEATURES } from "../types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isCurrent: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
  isDowngrade?: boolean;
}

export function PlanCard({
  plan,
  billingCycle,
  isCurrent,
  onSelect,
  isDowngrade = false,
}: PlanCardProps) {
  const price = PLAN_PRICES[plan][billingCycle];
  const features = PLAN_FEATURES[plan];
  const isPopular = plan === "pro";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border-2 p-6 transition-all",
        isCurrent
          ? "border-blue-500 bg-blue-50"
          : isPopular
          ? "border-blue-200 bg-white shadow-lg"
          : "border-gray-200 bg-white",
        !isCurrent && !isDowngrade && "hover:border-blue-300 hover:shadow-md"
      )}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
            Current Plan
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{PLAN_LABELS[plan]}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {price > 0 && (
            <span className="text-sm text-gray-500">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          )}
        </div>
        {billingCycle === "yearly" && price > 0 && (
          <p className="mt-1 text-xs text-green-600">
            Save ${((PLAN_PRICES[plan].monthly * 12 - price) / 12).toFixed(2)}/mo
          </p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      {onSelect && (
        <button
          onClick={() => onSelect(plan)}
          disabled={isCurrent}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            isCurrent
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : isDowngrade
              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {isCurrent ? "Current Plan" : isDowngrade ? "Downgrade" : "Upgrade"}
        </button>
      )}
    </div>
  );
}
