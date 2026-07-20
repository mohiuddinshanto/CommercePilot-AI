"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCategory, useDeleteCategory } from "@/features/categories/hooks/useCategories";
import { formatDateTime } from "@/lib/utils";
import { ErrorPage } from "@/components/common/ErrorPage";
import { ArrowLeft, FolderTree, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: category, isLoading, error } = useCategory(id);
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted.");
      router.push("/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category.");
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

  if (error || !category) {
    return <ErrorPage title="Category not found" message="Could not load category details." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/categories"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <FolderTree className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-sm text-gray-500">Slug: {category.slug}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/categories/${category._id}/edit`}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
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
            <dt className="text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(category.status)}`}
              >
                {category.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Sort Order</dt>
            <dd className="mt-1 font-medium text-gray-900">{category.sortOrder}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(category.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Updated</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(category.updatedAt)}</dd>
          </div>
        </dl>
        {category.description && (
          <div className="mt-4">
            <dt className="text-sm text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{category.description}</dd>
          </div>
        )}
      </div>
    </div>
  );
}
