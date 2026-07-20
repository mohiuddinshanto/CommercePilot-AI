"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  useAdminStores,
  useUpdateStoreStatus,
} from "@/features/admin/hooks/useAdmin";
import { StoreTable } from "@/features/admin/components/StoreTable";
import { StoreDetailsModal } from "@/features/admin/components/StoreDetailsModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { AdminStore } from "@/features/admin/types/admin";

export default function AdminStoresPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data, isLoading, error } = useAdminStores({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    plan: planFilter || undefined,
  });

  const updateStatus = useUpdateStoreStatus();

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title="Failed to load stores" message="Could not fetch stores." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleApprove = async (id: string) => {
    if (!confirm("Approve this store?")) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "approved" } });
      toast.success("Store approved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve store.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this store?")) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "rejected" } });
      toast.success("Store rejected.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject store.");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Suspend this store?")) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "suspended" } });
      toast.success("Store suspended.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to suspend store.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm text-gray-500">Manage all stores on the platform.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search stores..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
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

      <StoreTable
        items={items}
        onView={(store) => {
          setSelectedStore(store);
          setShowDetailsModal(true);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
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

      <StoreDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        store={selectedStore}
      />
    </div>
  );
}
