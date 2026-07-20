"use client";

import { PLAN_LABELS, type SubscriptionPlan, type BillingCycle } from "../types/subscription";
import { AlertTriangle, X } from "lucide-react";

interface DowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetPlan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isLoading?: boolean;
}

export function DowngradeModal({
  isOpen,
  onClose,
  onConfirm,
  targetPlan,
  billingCycle,
  isLoading = false,
}: DowngradeModalProps) {
  if (!isOpen) return null;

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

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Downgrade Plan</h3>
        <p className="mt-2 text-sm text-gray-600">
          You are about to downgrade to the{" "}
          <span className="font-medium">{PLAN_LABELS[targetPlan]}</span> plan ({billingCycle}).
        </p>

        <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          <p className="font-medium">Please note:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Your current plan features will remain until the end of the billing period</li>
            <li>After downgrade, some features may be restricted</li>
            <li>Data exceeding the new plan limits may need to be reduced</li>
          </ul>
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
            className="flex-1 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {isLoading ? "Downgrading..." : "Confirm Downgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}
