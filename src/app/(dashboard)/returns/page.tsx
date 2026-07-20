"use client";

import { useState } from "react";
import { useReturnList, useCreateReturn, useDeleteReturn, useReturnsSummary } from "@/features/returns/hooks/useReturns";
import { ReturnTable, ReturnTableSkeleton } from "@/features/returns/components/ReturnTable";
import { ReturnSummaryCard } from "@/features/returns/components/ReturnSummary";
import { ReturnForm } from "@/features/returns/components/ReturnForm";
import { ReturnModal } from "@/features/returns/components/ReturnModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { useSaleByInvoice } from "@/features/sales/hooks/useSales";
import { Plus, RotateCcw } from "lucide-react";
import type { CreateReturnInput } from "@/types/return";
import toast from "react-hot-toast";

export default function ReturnsPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const { data, isLoading, error } = useReturnList({ page, limit: 10 });
  const { data: summary } = useReturnsSummary();
  const createReturn = useCreateReturn();
  const deleteReturn = useDeleteReturn();
  const { data: saleData, isLoading: isSearching } = useSaleByInvoice(invoiceSearch);

  const handleCreate = async (input: CreateReturnInput) => {
    try {
      await createReturn.mutateAsync(input);
      setShowCreateModal(false);
      setInvoiceSearch("");
      toast.success("Return created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create return.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this return?")) return;
    try {
      await deleteReturn.mutateAsync(id);
      toast.success("Return deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete return.");
    }
  };

  const handleSearchInvoice = (invoice: string) => {
    setInvoiceSearch(invoice);
  };

  if (error) {
    return <ErrorPage title="Failed to load returns" message="Could not fetch returns." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RotateCcw className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Returns</h1>
            <p className="text-sm text-gray-500">
              Manage product returns and refunds.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Return
        </button>
      </div>

      {summary && <ReturnSummaryCard summary={summary} />}

      {isLoading ? (
        <ReturnTableSkeleton />
      ) : (
        <ReturnTable
          items={items}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ReturnModal
        title="New Return"
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setInvoiceSearch("");
        }}
      >
        <ReturnForm
          onSubmit={handleCreate}
          onCancel={() => {
            setShowCreateModal(false);
            setInvoiceSearch("");
          }}
          isLoading={createReturn.isPending}
          onSearchInvoice={handleSearchInvoice}
          sale={saleData || null}
          isSearching={isSearching}
        />
      </ReturnModal>
    </div>
  );
}
