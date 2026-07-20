"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminSubscription } from "../types/admin";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: { plan?: string; status?: string; billingCycle?: string }) => void;
  subscription: AdminSubscription | null;
  isLoading?: boolean;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onUpdate,
  subscription,
  isLoading = false,
}: SubscriptionModalProps) {
  const [plan, setPlan] = useState(subscription?.plan || "");
  const [status, setStatus] = useState(subscription?.status || "");
  const [billingCycle, setBillingCycle] = useState(subscription?.billingCycle || "");

  if (!isOpen || !subscription) return null;

  const handleUpdate = () => {
    const updates: { plan?: string; status?: string; billingCycle?: string } = {};
    if (plan !== subscription.plan) updates.plan = plan;
    if (status !== subscription.status) updates.status = status;
    if (billingCycle !== subscription.billingCycle) updates.billingCycle = billingCycle;

    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  };

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

        <h3 className="text-lg font-semibold text-gray-900">Update Subscription</h3>
        <p className="mt-1 text-sm text-gray-500">{subscription.storeName || subscription.storeId}</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="starter">Starter</option>
              <option value="pro">Professional</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="trialing">Trial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
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
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
