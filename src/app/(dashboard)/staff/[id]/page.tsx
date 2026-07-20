"use client";

import { use, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useStaff, useUpdateStaff, useDeleteStaff, useSuspendStaff, useActivateStaff } from "@/features/staff/hooks/useStaff";
import { StaffProfileCard } from "@/features/staff/components/StaffProfileCard";
import { StaffModal } from "@/features/staff/components/StaffModal";
import { StaffForm } from "@/features/staff/components/StaffForm";
import { RoleBadge } from "@/features/staff/components/RoleBadge";
import { ErrorPage } from "@/components/common/ErrorPage";
import { formatDateTime } from "@/lib/utils";
import { Users, ArrowLeft, Trash2, ShieldOff, Shield } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { UpdateStaffInput } from "@/types/staff";

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: staff, isLoading, error } = useStaff(id);
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const suspendStaff = useSuspendStaff();
  const activateStaff = useActivateStaff();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await deleteStaff.mutateAsync(id);
      toast.success("Staff member removed.");
      router.push("/staff");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove staff member.");
    }
  }, [deleteStaff, id, router]);

  const handleSuspend = useCallback(async () => {
    if (!confirm("Are you sure you want to suspend this staff member?")) return;
    try {
      await suspendStaff.mutateAsync(id);
      toast.success("Staff member suspended.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to suspend staff member.");
    }
  }, [suspendStaff, id]);

  const handleActivate = useCallback(async () => {
    try {
      await activateStaff.mutateAsync(id);
      toast.success("Staff member activated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to activate staff member.");
    }
  }, [activateStaff, id]);

  const handleUpdate = useCallback(async (input: UpdateStaffInput) => {
    try {
      await updateStaff.mutateAsync({ id, input });
      setShowEditModal(false);
      toast.success("Staff member updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update staff member.");
    }
  }, [updateStaff, id]);

  if (error) {
    return <ErrorPage title="Failed to load staff" message="Could not fetch staff member details." />;
  }

  if (isLoading || !staff) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/staff"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{staff.name}</h1>
            <p className="text-sm text-gray-500">
              {staff.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {staff.status === "active" && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleSuspend}
                className="flex items-center gap-2 rounded-lg border border-yellow-300 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50"
              >
                <ShieldOff className="h-4 w-4" />
                Suspend
              </button>
            </>
          )}
          {staff.status === "suspended" && (
            <button
              onClick={handleActivate}
              className="flex items-center gap-2 rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              <Shield className="h-4 w-4" />
              Activate
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StaffProfileCard staff={staff} />

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
            <div className="flex flex-wrap gap-2">
              {staff.permissions.map((perm) => (
                <span
                  key={perm}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {perm}
                </span>
              ))}
              {staff.permissions.length === 0 && (
                <p className="text-sm text-gray-500">No permissions assigned.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      staff.status === "active"
                        ? "bg-green-100 text-green-800"
                        : staff.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {staff.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Role</dt>
                <dd>
                  <RoleBadge role={staff.role} />
                </dd>
              </div>
              {staff.suspendedAt && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Suspended At</dt>
                  <dd className="text-sm text-gray-900">{formatDateTime(staff.suspendedAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(staff.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(staff.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <StaffModal
        title="Edit Staff Member"
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <StaffForm
          staff={staff}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          isLoading={updateStaff.isPending}
        />
      </StaffModal>
    </div>
  );
}
