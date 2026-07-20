"use client";

import { useState } from "react";
import { useSaleList, useCreateSale, useDeleteSale, useSalesSummary } from "@/features/sales/hooks/useSales";
import { SalesTable, SalesTableSkeleton } from "@/features/sales/components/SalesTable";
import { SalesSummaryCard } from "@/features/sales/components/SalesSummary";
import { SalesForm } from "@/features/sales/components/SalesForm";
import { SalesModal } from "@/features/sales/components/SalesModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Receipt } from "lucide-react";
import type { CreateSaleInput } from "@/types/sale";
import toast from "react-hot-toast";

export default function SalesPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useSaleList({ page, limit: 10 });
  const { data: summary } = useSalesSummary();
  const createSale = useCreateSale();
  const deleteSale = useDeleteSale();

  const handleCreate = async (input: CreateSaleInput) => {
    try {
      await createSale.mutateAsync(input);
      setShowCreateModal(false);
      toast.success("Sale created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create sale.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSale.mutateAsync(id);
      toast.success("Sale deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete sale.");
    }
  };

  if (error) {
    return <ErrorPage title="Failed to load sales" message="Could not fetch sales." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
            <p className="text-sm text-gray-500">
              Manage your sales transactions and invoices.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Sale
        </button>
      </div>

      {summary && <SalesSummaryCard summary={summary} />}

      {isLoading ? (
        <SalesTableSkeleton />
      ) : (
        <SalesTable
          items={items}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <SalesModal
        title="New Sale"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <SalesForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createSale.isPending}
        />
      </SalesModal>
    </div>
  );
}
