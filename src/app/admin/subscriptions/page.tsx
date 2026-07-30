"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/use-t";
import { useAuth } from "@/providers/auth-provider";
import {
  useAdminSubscriptions,
  useUpdateAdminSubscription,
  useAdminPlanRequests,
  useApprovePlanRequest,
  useRejectPlanRequest,
} from "@/features/admin/hooks/useAdmin";
import { SubscriptionTable } from "@/features/admin/components/SubscriptionTable";
import { SubscriptionModal } from "@/features/admin/components/SubscriptionModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield, ChevronLeft, ChevronRight, Check, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { AdminSubscription } from "@/features/admin/types/admin";

export default function AdminSubscriptionsPage() {
  const T = useT();
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

  const { data: planRequestsData, isLoading: reqsLoading } = useAdminPlanRequests({ status: "pending" });
  const approvePlanRequest = useApprovePlanRequest();
  const rejectPlanRequest = useRejectPlanRequest();

  const updateSubscription = useUpdateAdminSubscription();

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title={T("error.title")} message={T("error.message")} />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const pendingRequests = planRequestsData?.items || [];

  const handleApproveRequest = (id: string) => {
    approvePlanRequest.mutate(id, {
      onSuccess: () => toast.success(T("admin.subscriptionUpdated")),
      onError: (err) => toast.error(err instanceof Error ? err.message : T("error.message")),
    });
  };

  const handleRejectRequest = (id: string) => {
    rejectPlanRequest.mutate(id, {
      onSuccess: () => toast.success(T("admin.subscriptionUpdated")),
      onError: (err) => toast.error(err instanceof Error ? err.message : T("error.message")),
    });
  };

  const handleUpdate = async (updates: { plan?: string; status?: string; billingCycle?: string }) => {
    if (!selectedSub) return;
    try {
      await updateSubscription.mutateAsync({ id: selectedSub._id, input: updates });
      toast.success(T("admin.subscriptionUpdated"));
      setShowModal(false);
      setSelectedSub(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : T("error.message"));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("admin.subscriptionManagement")}</h1>
          <p className="text-sm text-gray-500">{T("admin.subscriptionManagementSubtitle")}</p>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-amber-900">
            <Clock className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold">{T("admin.pending")} {T("admin.subscriptions")} ({pendingRequests.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">{T("admin.storeName")}</th>
                  <th className="px-4 py-3">{T("admin.user")}</th>
                  <th className="px-4 py-3">{T("admin.currentPlan")}</th>
                  <th className="px-4 py-3">{T("admin.requestedPlan")}</th>
                  <th className="px-4 py-3">{T("admin.requestedAt")}</th>
                  <th className="px-4 py-3 text-right">{T("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingRequests.map((req: any) => (
                  <tr key={req._id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-gray-900">{req.storeName}</td>
                    <td className="px-4 py-3">
                      <div>{req.userName}</div>
                      <div className="text-xs text-gray-400">{req.userEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 uppercase">
                        {req.currentPlan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 uppercase">
                        {req.requestedPlan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveRequest(req._id)}
                          disabled={approvePlanRequest.isPending}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" /> {T("admin.approve")}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req._id)}
                          disabled={rejectPlanRequest.isPending}
                          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" /> {T("admin.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">{T("admin.subscriptionManagement")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder={T("admin.searchSubscriptions")}
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
            <option value="">{T("admin.allStatus")}</option>
            <option value="active">{T("admin.active")}</option>
            <option value="cancelled">{T("admin.cancelled")}</option>
            <option value="expired">{T("admin.expired")}</option>
            <option value="trialing">{T("admin.trial")}</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">{T("admin.allPlans")}</option>
            <option value="starter">{T("admin.starter")}</option>
            <option value="pro">{T("admin.professional")}</option>
            <option value="business">{T("admin.business")}</option>
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
              {T("common.pageOf").replace("{page}", String(page)).replace("{totalPages}", String(totalPages))}
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
      </div>

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
