"use client";

import { useState } from "react";
import { useStaffList, useInviteStaff, useDeleteStaff, useSuspendStaff, useActivateStaff } from "@/features/staff/hooks/useStaff";
import { StaffTable, StaffTableSkeleton } from "@/features/staff/components/StaffTable";
import { StaffModal } from "@/features/staff/components/StaffModal";
import { InviteStaffForm } from "@/features/staff/components/InviteStaffForm";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Users } from "lucide-react";
import type { InviteStaffInput } from "@/types/staff";
import toast from "react-hot-toast";

export default function StaffPage() {
  const [page, setPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, isLoading, error } = useStaffList({ page, limit: 10 });
  const inviteStaff = useInviteStaff();
  const deleteStaff = useDeleteStaff();
  const suspendStaff = useSuspendStaff();
  const activateStaff = useActivateStaff();

  const handleInvite = async (input: InviteStaffInput) => {
    try {
      await inviteStaff.mutateAsync(input);
      setShowInviteModal(false);
      toast.success("Staff invitation sent successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invitation.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await deleteStaff.mutateAsync(id);
      toast.success("Staff member removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove staff member.");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Are you sure you want to suspend this staff member?")) return;
    try {
      await suspendStaff.mutateAsync(id);
      toast.success("Staff member suspended.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to suspend staff member.");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateStaff.mutateAsync(id);
      toast.success("Staff member activated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to activate staff member.");
    }
  };

  if (error) {
    return <ErrorPage title="Failed to load staff" message="Could not fetch staff members." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
            <p className="text-sm text-gray-500">
              Manage your store staff and their permissions.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Invite Staff
        </button>
      </div>

      {isLoading ? (
        <StaffTableSkeleton />
      ) : (
        <StaffTable
          items={items}
          onDelete={handleDelete}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <StaffModal
        title="Invite Staff Member"
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      >
        <InviteStaffForm
          onSubmit={handleInvite}
          onCancel={() => setShowInviteModal(false)}
          isLoading={inviteStaff.isPending}
        />
      </StaffModal>
    </div>
  );
}
