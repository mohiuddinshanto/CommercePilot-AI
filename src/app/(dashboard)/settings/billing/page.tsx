"use client";

import { useBillingHistory } from "@/features/subscriptions/hooks/useSubscription";
import { BillingHistory } from "@/features/subscriptions/components/BillingHistory";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { useT } from "@/lib/i18n/use-t";
import { Receipt } from "lucide-react";

export default function BillingPage() {
  const T = useT();
  const { data: billingHistory, isLoading, error } = useBillingHistory();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorPage title={T("billing.errorTitle", "Failed to load billing")} message={T("billing.errorMessage", "Could not fetch billing history.")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("billing.title", "Billing History")}</h1>
          <p className="text-sm text-gray-500">
            {T("billing.subtitle", "View your past invoices and payment history.")}
          </p>
        </div>
      </div>

      <BillingHistory records={billingHistory || []} />
    </div>
  );
}
