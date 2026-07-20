"use client";

import { useState, useCallback } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { ProductTable, ProductTableSkeleton } from "@/features/products/components/ProductTable";
import { ProductForm } from "@/features/products/components/ProductForm";
import { ProductModal } from "@/features/products/components/ProductModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, Package } from "lucide-react";
import type { CreateProductInput, UpdateProductInput } from "@/types/product";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useProducts({ page, limit: 10 });
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleCreate = async (input: CreateProductInput | UpdateProductInput) => {
    try {
      await createProduct.mutateAsync(input as CreateProductInput);
      setShowCreateModal(false);
      toast.success("Product created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product.");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Product deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete product.");
      }
    },
    [deleteProduct]
  );

  if (error) {
    return <ErrorPage title="Failed to load products" message="Could not fetch products." />;
  }

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">
              Manage your product inventory.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
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
        />
      )}

      <ProductModal
        title="Create Product"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createProduct.isPending}
        />
      </ProductModal>
    </div>
  );
}
