"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  useInventory,
  useDeleteInventory,
  useUpdateInventory,
  useStockIn,
  useStockOut,
  useAdjustStock,
  useInventoryMovements,
} from "@/features/inventory/hooks/useInventory";
import { InventoryForm } from "@/features/inventory/components/InventoryForm";
import { InventoryModal } from "@/features/inventory/components/InventoryModal";
import { InventoryMovementTable } from "@/features/inventory/components/InventoryMovementTable";
import { formatDateTime } from "@/lib/utils";
import { ErrorPage } from "@/components/common/ErrorPage";
import {
  ArrowLeft,
  Package,
  Pencil,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import type { UpdateInventoryInput, StockMovementInput } from "@/types/inventory";

function getStockStatus(currentStock: number, lowStockLimit: number) {
  if (currentStock === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
  if (currentStock <= lowStockLimit) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
  return { label: "In Stock", className: "bg-green-100 text-green-800" };
}

interface MovementFormContentProps {
  movementQty: string;
  setMovementQty: (v: string) => void;
  movementRef: string;
  setMovementRef: (v: string) => void;
  movementNotes: string;
  setMovementNotes: (v: string) => void;
  showStockInModal: boolean;
  showStockOutModal: boolean;
  setShowStockInModal: (v: boolean) => void;
  setShowStockOutModal: (v: boolean) => void;
  setShowAdjustModal: (v: boolean) => void;
  handleStockMovement: (type: "stock_in" | "stock_out" | "adjustment") => Promise<void>;
  isPending: boolean;
}

function MovementFormContent({
  movementQty,
  setMovementQty,
  movementRef,
  setMovementRef,
  movementNotes,
  setMovementNotes,
  showStockInModal,
  showStockOutModal,
  setShowStockInModal,
  setShowStockOutModal,
  setShowAdjustModal,
  handleStockMovement,
  isPending,
}: MovementFormContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={movementQty}
          onChange={(e) => setMovementQty(e.target.value)}
          min="1"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter quantity"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Reference</label>
        <input
          type="text"
          value={movementRef}
          onChange={(e) => setMovementRef(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. PO-12345"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={movementNotes}
          onChange={(e) => setMovementNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Optional notes..."
        />
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => {
            setShowStockInModal(false);
            setShowStockOutModal(false);
            setShowAdjustModal(false);
            setMovementQty("");
            setMovementRef("");
            setMovementNotes("");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!movementQty || Number(movementQty) <= 0) {
              toast.error("Please enter a valid quantity.");
              return;
            }
            const type = showStockInModal ? "stock_in" : showStockOutModal ? "stock_out" : "adjustment";
            handleStockMovement(type);
          }}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default function InventoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: inventory, isLoading, error } = useInventory(id);
  const { data: movements } = useInventoryMovements(id);
  const deleteInventory = useDeleteInventory();
  const updateInventory = useUpdateInventory();
  const stockIn = useStockIn();
  const stockOut = useStockOut();
  const adjustStock = useAdjustStock();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [movementQty, setMovementQty] = useState("");
  const [movementRef, setMovementRef] = useState("");
  const [movementNotes, setMovementNotes] = useState("");

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this inventory record?")) return;
    try {
      await deleteInventory.mutateAsync(id);
      toast.success("Inventory record deleted.");
      router.push("/inventory");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete inventory record.");
    }
  };

  const handleUpdate = async (input: UpdateInventoryInput) => {
    try {
      await updateInventory.mutateAsync({ id, input });
      setShowEditModal(false);
      toast.success("Inventory updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update inventory.");
    }
  };

  const handleStockMovement = async (type: "stock_in" | "stock_out" | "adjustment") => {
    const input: StockMovementInput = {
      quantity: Number(movementQty),
      reference: movementRef || undefined,
      notes: movementNotes || undefined,
    };

    try {
      if (type === "stock_in") {
        await stockIn.mutateAsync({ id, input });
      } else if (type === "stock_out") {
        await stockOut.mutateAsync({ id, input });
      } else {
        await adjustStock.mutateAsync({ id, input });
      }
      setShowStockInModal(false);
      setShowStockOutModal(false);
      setShowAdjustModal(false);
      setMovementQty("");
      setMovementRef("");
      setMovementNotes("");
      toast.success(`${type.replace("_", " ")} recorded successfully.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record movement.");
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
    return <ErrorPage title="Inventory not found" message="Could not load inventory details." />;
  }

  const stockStatus = getStockStatus(inventory.currentStock, inventory.lowStockLimit);

  const movementFormProps = {
    movementQty,
    setMovementQty,
    movementRef,
    setMovementRef,
    movementNotes,
    setMovementNotes,
    showStockInModal,
    showStockOutModal,
    setShowStockInModal,
    setShowStockOutModal,
    setShowAdjustModal,
    handleStockMovement,
    isPending: stockIn.isPending || stockOut.isPending || adjustStock.isPending,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/inventory"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Details</h1>
              <p className="text-sm text-gray-500 font-mono">{inventory._id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStockInModal(true)}
            className="flex items-center gap-2 rounded-lg border border-green-300 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            <ArrowDownCircle className="h-4 w-4" />
            Stock In
          </button>
          <button
            onClick={() => setShowStockOutModal(true)}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Stock Out
          </button>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center gap-2 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            <Settings className="h-4 w-4" />
            Adjust
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Details</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Current Stock</dt>
            <dd className="mt-1 text-xl font-bold text-gray-900">{inventory.currentStock}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Available Stock</dt>
            <dd className="mt-1 text-xl font-bold text-gray-900">{inventory.availableStock}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Reserved Stock</dt>
            <dd className="mt-1 font-medium text-gray-900">{inventory.reservedStock}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Low Stock Limit</dt>
            <dd className="mt-1 font-medium text-gray-900">{inventory.lowStockLimit}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockStatus.className}`}
              >
                {stockStatus.label}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Cost Price</dt>
            <dd className="mt-1 font-medium text-gray-900">${(inventory.costPrice ?? 0).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Restocked</dt>
            <dd className="mt-1 text-gray-900">
              {inventory.lastRestockedAt ? formatDateTime(inventory.lastRestockedAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Sold</dt>
            <dd className="mt-1 text-gray-900">
              {inventory.lastSoldAt ? formatDateTime(inventory.lastSoldAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(inventory.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Updated</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(inventory.updatedAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Movement History</h3>
        <div className="mt-4">
          <InventoryMovementTable movements={movements || []} />
        </div>
      </div>

      <InventoryModal
        title="Edit Inventory"
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <InventoryForm
          inventory={inventory}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          isLoading={updateInventory.isPending}
        />
      </InventoryModal>

      <InventoryModal
        title="Stock In"
        isOpen={showStockInModal}
        onClose={() => setShowStockInModal(false)}
      >
        <MovementFormContent {...movementFormProps} />
      </InventoryModal>

      <InventoryModal
        title="Stock Out"
        isOpen={showStockOutModal}
        onClose={() => setShowStockOutModal(false)}
      >
        <MovementFormContent {...movementFormProps} />
      </InventoryModal>

      <InventoryModal
        title="Adjust Stock"
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
      >
        <MovementFormContent {...movementFormProps} />
      </InventoryModal>
    </div>
  );
}
