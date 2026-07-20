"use client";

import { formatDate, formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type {
  SubscriptionDocument,
  SubscriptionStatus,
} from "../types/subscription";
import { PLAN_LABELS, STATUS_LABELS } from "../types/subscription";

function getStatusConfig(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    case "trialing":
      return {
        icon: Clock,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    case "expired":
      return {
        icon: AlertTriangle,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    default:
      return {
        icon: CreditCard,
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

interface SubscriptionCardProps {
  subscription: SubscriptionDocument;
  onUpgrade?: () => void;
}

export function SubscriptionCard({ subscription, onUpgrade }: SubscriptionCardProps) {
  const statusConfig = getStatusConfig(subscription.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`rounded-lg border ${statusConfig.border} ${statusConfig.bg} p-6`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {PLAN_LABELS[subscription.plan]}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}
            >
              <StatusIcon className="h-3 w-3" />
              {STATUS_LABELS[subscription.status]}
            </span>
          </div>
        </div>
        {subscription.plan !== "business" && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Upgrade Plan
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {subscription.price === 0
              ? "Free"
              : `${formatCurrency(subscription.price)}/${subscription.billingCycle}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Renews: {formatDate(subscription.renewalDate)}</span>
        </div>
      </div>

      {subscription.isTrial && subscription.trialEndsAt && (
        <div className="mt-3 rounded-md bg-blue-100 p-2 text-sm text-blue-800">
          Trial ends: {formatDate(subscription.trialEndsAt)}
        </div>
      )}

      {subscription.cancelledAt && (
        <div className="mt-3 rounded-md bg-red-100 p-2 text-sm text-red-800">
          Cancelled on: {formatDate(subscription.cancelledAt)}
        </div>
      )}
    </div>
  );
}
