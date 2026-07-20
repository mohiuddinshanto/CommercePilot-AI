"use client";

import { useBillingHistory } from "@/features/subscriptions/hooks/useSubscription";
import { BillingHistory } from "@/features/subscriptions/components/BillingHistory";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Receipt } from "lucide-react";

export default function BillingPage() {
  const { data: billingHistory, isLoading, error } = useBillingHistory();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorPage title="Failed to load billing" message="Could not fetch billing history." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing History</h1>
          <p className="text-sm text-gray-500">
            View your past invoices and payment history.
          </p>
        </div>
      </div>

      <BillingHistory records={billingHistory || []} />
    </div>
  );
}
