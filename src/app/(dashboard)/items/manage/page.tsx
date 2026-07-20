"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useProducts, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { ProductTable, ProductTableSkeleton } from "@/features/products/components/ProductTable";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Package, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageItemsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useProducts({ 
    page, 
    limit: 10,
    search: search || undefined
  });
  const deleteProduct = useDeleteProduct();

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Item deleted successfully.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete item.");
      }
    },
    [deleteProduct]
  );

  if (error) {
    return <ErrorPage title="Failed to load items" message="Could not fetch catalog items." />;
  }

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Items</h1>
            <p className="text-sm text-gray-500">
              Create, view, and delete public items in your store.
            </p>
          </div>
        </div>
        <Link
          href="/items/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Link>
      </div>

      <div className="flex items-center gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name, SKU or barcode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {isLoading ? (
        <ProductTableSkeleton />
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          viewHref={(id) => `/items/${id}`}
        />
      )}
    </div>
  );
}
