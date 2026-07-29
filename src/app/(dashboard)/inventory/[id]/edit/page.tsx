"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  useInventory,
  useUpdateInventory,
} from "@/features/inventory/hooks/useInventory";
import { InventoryForm } from "@/features/inventory/components/InventoryForm";
import { ErrorPage } from "@/components/common/ErrorPage";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { UpdateInventoryInput } from "@/types/inventory";

export default function InventoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: inventory, isLoading, error } = useInventory(id);
  const updateInventory = useUpdateInventory();

  const handleUpdate = async (input: UpdateInventoryInput) => {
    try {
      await updateInventory.mutateAsync({ id, input });
      toast.success("Inventory updated successfully.");
      router.push(`/inventory/${id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update inventory."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (error || !inventory) {
    return (
      <ErrorPage
        title="Inventory not found"
        message="Could not load inventory details."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/inventory/${id}`}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Inventory</h1>
            <p className="text-sm text-gray-500 font-mono">{inventory._id}</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 max-w-xl">
        <InventoryForm
          inventory={inventory}
          onSubmit={(data) => handleUpdate(data as UpdateInventoryInput)}
          onCancel={() => router.push(`/inventory/${id}`)}
          isLoading={updateInventory.isPending}
        />
      </div>
    </div>
  );
}
