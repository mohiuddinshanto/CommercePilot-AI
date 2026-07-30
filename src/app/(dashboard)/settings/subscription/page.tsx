"use client";

import { useState } from "react";
import {
  useSubscription,
  useSubscriptionUsage,
  useCreateSubscription,
  useCancelSubscription,
  useMyPlanRequest,
  useRequestPlanChange,
} from "@/features/subscriptions/hooks/useSubscription";
import { SubscriptionCard } from "@/features/subscriptions/components/SubscriptionCard";
import { UsageCard } from "@/features/subscriptions/components/UsageCard";
import { PlanCard } from "@/features/subscriptions/components/PlanCard";
import { UpgradeModal } from "@/features/subscriptions/components/UpgradeModal";
import { DowngradeModal } from "@/features/subscriptions/components/DowngradeModal";
import { CancelSubscriptionModal } from "@/features/subscriptions/components/CancelSubscriptionModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { useT } from "@/lib/i18n/use-t";
import { CreditCard, Clock, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import type { SubscriptionPlan, BillingCycle } from "@/features/subscriptions/types/subscription";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const T = useT();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [targetPlan, setTargetPlan] = useState<SubscriptionPlan>("pro");

  const { data: subscription, isLoading, error } = useSubscription();
  const { data: usage } = useSubscriptionUsage();
  const { data: pendingRequest } = useMyPlanRequest() as { data: any };

  const createSubscription = useCreateSubscription();
  const requestPlanChange = useRequestPlanChange();
  const cancelSubscription = useCancelSubscription();

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (!subscription) {
      setTargetPlan(plan);
      createSubscription.mutate(
        { plan, billingCycle },
        {
          onSuccess: () => {
            toast.success("Subscription created successfully.");
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to create subscription.");
          },
        }
      );
      return;
    }

    const planOrder: SubscriptionPlan[] = ["starter", "pro", "business"];
    const currentIdx = planOrder.indexOf(subscription.plan);
    const targetIdx = planOrder.indexOf(plan);

    setTargetPlan(plan);
    if (targetIdx > currentIdx) {
      setShowUpgradeModal(true);
    } else {
      setShowDowngradeModal(true);
    }
  };

  const handleConfirmRequest = () => {
    requestPlanChange.mutate(targetPlan, {
      onSuccess: () => {
        toast.success(`Plan change request for ${targetPlan.toUpperCase()} submitted for Admin approval.`);
        setShowUpgradeModal(false);
        setShowDowngradeModal(false);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to submit plan change request.");
      },
    });
  };

  const handleConfirmCancel = () => {
    cancelSubscription.mutate(undefined, {
      onSuccess: () => {
        toast.success("Subscription cancelled.");
        setShowCancelModal(false);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to cancel subscription.");
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorPage title={T("subscription.errorTitle", "Failed to load subscription")} message={T("subscription.errorMessage", "Could not fetch subscription data.")} />;
  }

  const hasNoSubscription = !subscription;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("subscription.title", "Subscription & Billing")}</h1>
          <p className="text-sm text-gray-500">
            {T("subscription.subtitle", "Manage your subscription plan and billing settings.")}
          </p>
        </div>
      </div>

      {pendingRequest && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-sm">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div className="flex-1 text-sm">
              <h4 className="font-semibold text-amber-900">{T("subscription.pendingApproval", "Plan Change Request Pending Approval")}</h4>
            <p className="mt-1 text-amber-800">
              You have requested to change your plan to{" "}
              <span className="font-bold uppercase text-amber-950">{pendingRequest.requestedPlan}</span>.
              Super Admin is currently reviewing your request.
            </p>
          </div>
        </div>
      )}

      {hasNoSubscription ? (
        <EmptyState
          title={T("subscription.noActive", "No active subscription")}
          message={T("subscription.choosePlan", "Choose a plan below to get started.")}
          icon={CreditCard}
        />
      ) : (
        <>
          <SubscriptionCard
            subscription={subscription!}
            onUpgrade={() => {
              setTargetPlan(subscription!.plan === "starter" ? "pro" : "business");
              setShowUpgradeModal(true);
            }}
          />

          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            {T("subscription.cancel", "Cancel subscription")}
          </button>

          {usage && subscription && (
            <UsageCard limits={subscription.limits} usage={usage} />
          )}
        </>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{T("subscription.availablePlans", "Available Plans")}</h3>
          <div className="flex items-center gap-2 self-start rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {T("subscription.monthly", "Monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {T("subscription.yearly", "Yearly")} <span className="text-xs text-green-600">{T("subscription.savePercent", "Save 17%")}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PlanCard
            plan="starter"
            billingCycle={billingCycle}
            isCurrent={subscription?.plan === "starter"}
            onSelect={handlePlanSelect}
          />
          <PlanCard
            plan="pro"
            billingCycle={billingCycle}
            isCurrent={subscription?.plan === "pro"}
            onSelect={handlePlanSelect}
            isDowngrade={subscription?.plan === "business"}
          />
          <PlanCard
            plan="business"
            billingCycle={billingCycle}
            isCurrent={subscription?.plan === "business"}
            onSelect={handlePlanSelect}
            isDowngrade={false}
          />
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={handleConfirmRequest}
        targetPlan={targetPlan}
        billingCycle={billingCycle}
        isLoading={requestPlanChange.isPending}
      />

      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        onConfirm={handleConfirmRequest}
        targetPlan={targetPlan}
        billingCycle={billingCycle}
        isLoading={requestPlanChange.isPending}
      />

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        isLoading={cancelSubscription.isPending}
      />
    </div>
  );
}
