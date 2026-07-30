"use client";

import { useState, useMemo } from "react";
import { useReturnList, useCreateReturn, useDeleteReturn, useReturnsSummary } from "@/features/returns/hooks/useReturns";
import { ReturnTable, ReturnTableSkeleton } from "@/features/returns/components/ReturnTable";
import { ReturnSummaryCard } from "@/features/returns/components/ReturnSummary";
import { ReturnForm } from "@/features/returns/components/ReturnForm";
import { ReturnModal } from "@/features/returns/components/ReturnModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { useSaleList } from "@/features/sales/hooks/useSales";
import { useT } from "@/lib/i18n/use-t";
import { Plus, RotateCcw, Search } from "lucide-react";
import type { CreateReturnInput } from "@/types/return";
import type { Sale } from "@/types/sale";
import toast from "react-hot-toast";

export default function ReturnsPage() {
  const T = useT();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saleSearchQuery, setSaleSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { data, isLoading, error } = useReturnList({ page, limit: 10 });
  const { data: summary } = useReturnsSummary();
  const { data: salesData, isLoading: isSearching } = useSaleList({
    search: saleSearchQuery || undefined,
    limit: 10,
  });
  const createReturn = useCreateReturn();
  const deleteReturn = useDeleteReturn();

  const sales = salesData?.items || [];

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    if (!search.trim()) return data.items;
    const q = search.toLowerCase();
    return data.items.filter(
      (r) =>
        r.invoiceNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.customerPhone && r.customerPhone.includes(q))
    );
  }, [data?.items, search]);

  const totalPages = data?.totalPages || 1;

  const handleCreate = async (input: CreateReturnInput) => {
    try {
      await createReturn.mutateAsync(input);
      setShowCreateModal(false);
      setSaleSearchQuery("");
      setSelectedSale(null);
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

  const handleSearchSales = (query: string) => {
    setSaleSearchQuery(query);
  };

  const handleSelectSale = (sale: Sale | null) => {
    setSelectedSale(sale);
  };

  if (error) {
    return <ErrorPage title={T("returns.errorTitle", "Failed to load returns")} message={T("returns.errorMessage", "Could not fetch returns.")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RotateCcw className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{T("returns.title")}</h1>
            <p className="text-sm text-gray-600">
              {T("returns.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {T("returns.new")}
        </button>
      </div>

      {summary && <ReturnSummaryCard summary={summary} />}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={T("returns.searchPlaceholder")}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {isLoading ? (
        <ReturnTableSkeleton />
      ) : (
        <ReturnTable
          items={filteredItems}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ReturnModal
        title={T("returns.new")}
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSaleSearchQuery("");
          setSelectedSale(null);
        }}
      >
        <ReturnForm
          onSubmit={handleCreate}
          onCancel={() => {
            setShowCreateModal(false);
            setSaleSearchQuery("");
            setSelectedSale(null);
          }}
          isLoading={createReturn.isPending}
          onSearchSales={handleSearchSales}
          sales={sales}
          selectedSale={selectedSale}
          onSelectSale={handleSelectSale}
          isSearching={isSearching}
        />
      </ReturnModal>
    </div>
  );
}
