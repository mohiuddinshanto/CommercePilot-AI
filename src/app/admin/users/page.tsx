"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/use-t";
import { useAuth } from "@/providers/auth-provider";
import { useAdminUsers, useUpdateUserStatus } from "@/features/admin/hooks/useAdmin";
import { UserTable } from "@/features/admin/components/UserTable";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const T = useT();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading, error } = useAdminUsers({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    role: roleFilter || undefined,
  });

  const updateStatus = useUpdateUserStatus();

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

  const handleApprove = async (id: string) => {
    if (!confirm(T("confirm.approveUser"))) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "approved" } });
      toast.success(T("admin.userApproved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : T("error.message"));
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm(T("confirm.rejectUser"))) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "rejected" } });
      toast.success(T("admin.userRejected"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : T("error.message"));
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm(T("confirm.suspendUser"))) return;
    try {
      await updateStatus.mutateAsync({ id, input: { status: "suspended" } });
      toast.success(T("admin.userSuspended"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : T("error.message"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("admin.userManagement")}</h1>
          <p className="text-sm text-gray-500">{T("admin.userManagementSubtitle")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder={T("admin.searchUsers")}
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
          <option value="pending">{T("admin.pending")}</option>
          <option value="approved">{T("admin.approved")}</option>
          <option value="rejected">{T("admin.rejected")}</option>
          <option value="suspended">{T("admin.suspended")}</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{T("admin.allRoles")}</option>
          <option value="owner">{T("admin.owner")}</option>
          <option value="staff">{T("admin.staff")}</option>
        </select>
      </div>

      <UserTable
        items={items}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
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
  );
}
