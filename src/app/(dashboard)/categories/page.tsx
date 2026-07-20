"use client";

import { useState, useCallback } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/features/categories/hooks/useCategories";
import { CategoryTable, CategoryTableSkeleton } from "@/features/categories/components/CategoryTable";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { CategoryModal } from "@/features/categories/components/CategoryModal";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Plus, FolderTree } from "lucide-react";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useCategories({ page, limit: 10 });
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = async (input: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      await createCategory.mutateAsync(input as CreateCategoryInput);
      setShowCreateModal(false);
      toast.success("Category created successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category.");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this category?")) return;
      try {
        await deleteCategory.mutateAsync(id);
        toast.success("Category deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete category.");
      }
    },
    [deleteCategory]
  );

  if (error) {
    return <ErrorPage title="Failed to load categories" message="Could not fetch categories." />;
  }

  const categories = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">
              Organize your products into categories.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <CategoryTableSkeleton />
      ) : (
        <CategoryTable
          categories={categories}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <CategoryModal
        title="Create Category"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createCategory.isPending}
        />
      </CategoryModal>
    </div>
  );
}
