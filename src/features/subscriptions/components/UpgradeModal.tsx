"use client";

import { formatCurrency } from "@/lib/utils";
import { PLAN_PRICES, PLAN_LABELS, type SubscriptionPlan, type BillingCycle } from "../types/subscription";
import { AlertTriangle, X } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetPlan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isLoading?: boolean;
}

export function UpgradeModal({
  isOpen,
  onClose,
  onConfirm,
  targetPlan,
  billingCycle,
  isLoading = false,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const price = PLAN_PRICES[targetPlan][billingCycle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <AlertTriangle className="h-6 w-6 text-blue-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Upgrade Plan</h3>
        <p className="mt-2 text-sm text-gray-600">
          You are about to upgrade to the{" "}
          <span className="font-medium">{PLAN_LABELS[targetPlan]}</span> plan.
        </p>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">New plan</span>
            <span className="text-sm font-medium text-gray-900">
              {PLAN_LABELS[targetPlan]}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Billing</span>
            <span className="text-sm font-medium text-gray-900">
              {price === 0 ? "Free" : `${formatCurrency(price)}/${billingCycle === "monthly" ? "month" : "year"}`}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Upgrading..." : "Confirm Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}
