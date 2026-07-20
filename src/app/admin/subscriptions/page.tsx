"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  useAdminSubscriptions,
  useUpdateAdminSubscription,
} from "@/features/admin/hooks/useAdmin";
import { SubscriptionTable } from "@/features/admin/components/SubscriptionTable";
import { SubscriptionModal } from "@/features/admin/components/SubscriptionModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { AdminSubscription } from "@/features/admin/types/admin";

export default function AdminSubscriptionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedSub, setSelectedSub] = useState<AdminSubscription | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, error } = useAdminSubscriptions({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    plan: planFilter || undefined,
  });

  const updateSubscription = useUpdateAdminSubscription();

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title="Failed to load subscriptions" message="Could not fetch subscriptions." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleUpdate = async (updates: { plan?: string; status?: string; billingCycle?: string }) => {
    if (!selectedSub) return;
    try {
      await updateSubscription.mutateAsync({ id: selectedSub._id, input: updates });
      toast.success("Subscription updated.");
      setShowModal(false);
      setSelectedSub(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update subscription.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-sm text-gray-500">Manage all subscriptions on the platform.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
          <option value="trialing">Trial</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Professional</option>
          <option value="business">Business</option>
        </select>
      </div>

      <SubscriptionTable
        items={items}
        onUpdate={(sub) => {
          setSelectedSub(sub);
          setShowModal(true);
        }}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdate}
        subscription={selectedSub}
        isLoading={updateSubscription.isPending}
      />
    </div>
  );
}
