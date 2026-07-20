"use client";

import { useState } from "react";
import {
  useSubscription,
  useSubscriptionUsage,
  useCreateSubscription,
  useUpgradePlan,
  useDowngradePlan,
  useCancelSubscription,
} from "@/features/subscriptions/hooks/useSubscription";
import { SubscriptionCard } from "@/features/subscriptions/components/SubscriptionCard";
import { UsageCard } from "@/features/subscriptions/components/UsageCard";
import { PlanCard } from "@/features/subscriptions/components/PlanCard";
import { UpgradeModal } from "@/features/subscriptions/components/UpgradeModal";
import { DowngradeModal } from "@/features/subscriptions/components/DowngradeModal";
import { CancelSubscriptionModal } from "@/features/subscriptions/components/CancelSubscriptionModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import type { SubscriptionPlan, BillingCycle } from "@/features/subscriptions/types/subscription";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [targetPlan, setTargetPlan] = useState<SubscriptionPlan>("pro");

  const { data: subscription, isLoading, error } = useSubscription();
  const { data: usage } = useSubscriptionUsage();

  const createSubscription = useCreateSubscription();
  const upgradePlan = useUpgradePlan();
  const downgradePlan = useDowngradePlan();
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

  const handleConfirmUpgrade = () => {
    upgradePlan.mutate(
      { plan: targetPlan, billingCycle },
      {
        onSuccess: () => {
          toast.success("Plan upgraded successfully.");
          setShowUpgradeModal(false);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to upgrade plan.");
        },
      }
    );
  };

  const handleConfirmDowngrade = () => {
    downgradePlan.mutate(
      { plan: targetPlan, billingCycle },
      {
        onSuccess: () => {
          toast.success("Plan downgraded successfully.");
          setShowDowngradeModal(false);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to downgrade plan.");
        },
      }
    );
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
    return <ErrorPage title="Failed to load subscription" message="Could not fetch subscription data." />;
  }

  const hasNoSubscription = !subscription;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-500">
            Manage your subscription plan and billing settings.
          </p>
        </div>
      </div>

      {hasNoSubscription ? (
        <EmptyState
          title="No active subscription"
          message="Choose a plan below to get started."
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
            Cancel subscription
          </button>

          {usage && subscription && (
            <UsageCard limits={subscription.limits} usage={usage} />
          )}
        </>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Available Plans</h3>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly <span className="text-xs text-green-600">Save 17%</span>
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
        onConfirm={handleConfirmUpgrade}
        targetPlan={targetPlan}
        billingCycle={billingCycle}
        isLoading={upgradePlan.isPending}
      />

      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        onConfirm={handleConfirmDowngrade}
        targetPlan={targetPlan}
        billingCycle={billingCycle}
        isLoading={downgradePlan.isPending}
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
