"use client";

import { AlertTriangle, X } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelModalProps) {
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

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to cancel your subscription? This action cannot be undone.
        </p>

        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">What happens when you cancel:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Your subscription will remain active until the end of the billing period</li>
            <li>You will be downgraded to the Starter (free) plan</li>
            <li>Some features will be restricted after the downgrade</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}
