"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCategory, useUpdateCategory } from "@/features/categories/hooks/useCategories";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { ErrorPage } from "@/components/common/ErrorPage";
import { FullPageLoader } from "@/components/common/Loader";
import { ArrowLeft, FolderTree } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: category, isLoading, error } = useCategory(id);
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      await updateCategory.mutateAsync({
        id,
        input: data as UpdateCategoryInput,
      });
      toast.success("Category updated successfully.");
      router.push(`/categories/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update category.");
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error || !category) {
    return <ErrorPage title="Category not found" message="Could not load category details for editing." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/categories/${id}`}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <FolderTree className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-sm text-gray-500">Update category details and settings.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/categories/${id}`)}
          isLoading={updateCategory.isPending}
        />
      </div>
    </div>
  );
}
