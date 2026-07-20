"use client";

import { useState, useCallback } from "react";
import { useInventoryList, useCreateInventory, useDeleteInventory } from "@/features/inventory/hooks/useInventory";
import { InventoryTable, InventoryTableSkeleton } from "@/features/inventory/components/InventoryTable";
import { InventoryForm } from "@/features/inventory/components/InventoryForm";
import { InventoryModal } from "@/features/inventory/components/InventoryModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Package } from "lucide-react";
import type { CreateInventoryInput, UpdateInventoryInput } from "@/types/inventory";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useInventoryList({ page, limit: 10 });
  const createInventory = useCreateInventory();
  const deleteInventory = useDeleteInventory();

  const handleCreate = async (input: CreateInventoryInput | UpdateInventoryInput) => {
    try {
      await createInventory.mutateAsync(input as CreateInventoryInput);
      setShowCreateModal(false);
      toast.success("Inventory record created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create inventory record.");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this inventory record?")) return;
      try {
        await deleteInventory.mutateAsync(id);
        toast.success("Inventory record deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete inventory record.");
      }
    },
    [deleteInventory]
  );

  if (error) {
    return <ErrorPage title="Failed to load inventory" message="Could not fetch inventory records." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500">
              Manage stock levels for your products.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Inventory
        </button>
      </div>

      {isLoading ? (
        <InventoryTableSkeleton />
      ) : (
        <InventoryTable
          items={items}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <InventoryModal
        title="Create Inventory"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <InventoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createInventory.isPending}
        />
      </InventoryModal>
    </div>
  );
}
