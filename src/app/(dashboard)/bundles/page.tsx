"use client";

import { useState, useCallback } from "react";
import { useBundleList, useCreateBundle, useDeleteBundle } from "@/features/bundles/hooks/useBundles";
import { BundleTable, BundleTableSkeleton } from "@/features/bundles/components/BundleTable";
import { BundleForm } from "@/features/bundles/components/BundleForm";
import { BundleModal } from "@/features/bundles/components/BundleModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Package } from "lucide-react";
import type { CreateBundleInput, UpdateBundleInput } from "@/types/bundle";
import toast from "react-hot-toast";

export default function BundlesPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useBundleList({ page, limit: 10 });
  const createBundle = useCreateBundle();
  const deleteBundle = useDeleteBundle();

  const handleCreate = async (input: CreateBundleInput | UpdateBundleInput) => {
    try {
      await createBundle.mutateAsync(input as CreateBundleInput);
      setShowCreateModal(false);
      toast.success("Bundle created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create bundle.");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this bundle?")) return;
      try {
        await deleteBundle.mutateAsync(id);
        toast.success("Bundle deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete bundle.");
      }
    },
    [deleteBundle]
  );

  if (error) {
    return <ErrorPage title="Failed to load bundles" message="Could not fetch bundles." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bundles</h1>
            <p className="text-sm text-gray-500">
              Create product bundles with special pricing.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Bundle
        </button>
      </div>

      {isLoading ? (
        <BundleTableSkeleton />
      ) : (
        <BundleTable
          items={items}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <BundleModal
        title="Create Bundle"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <BundleForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createBundle.isPending}
        />
      </BundleModal>
    </div>
  );
}
