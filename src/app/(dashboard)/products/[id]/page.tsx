"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ErrorPage } from "@/components/common/ErrorPage";
import { ArrowLeft, Package, Pencil, Trash2 } from "lucide-react";
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
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted.");
      router.push("/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product.");
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

  if (error || !product) {
    return <ErrorPage title="Product not found" message="Could not load product details." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product._id}/edit`}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(product.status)}`}
                  >
                    {product.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Barcode</dt>
                <dd className="mt-1 font-medium text-gray-900">{product.barcode || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="mt-1 text-gray-900">{formatDate(product.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Updated</dt>
                <dd className="mt-1 text-gray-900">{formatDate(product.updatedAt)}</dd>
              </div>
            </dl>
            {product.description && (
              <div className="mt-4">
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
              </div>
            )}
            {product.tags.length > 0 && (
              <div className="mt-4">
                <dt className="text-sm text-gray-500">Tags</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Stock</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Cost Price</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(product.costPrice)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Selling Price</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(product.sellingPrice)}</dd>
              </div>
              {product.discountPrice != null && product.discountPrice > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Discount Price</dt>
                  <dd className="font-medium text-green-600">{formatCurrency(product.discountPrice)}</dd>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3" />
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Stock</dt>
                <dd
                  className={`font-medium ${
                    product.stock <= product.lowStockLimit ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {product.stock}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Low Stock Limit</dt>
                <dd className="font-medium text-gray-900">{product.lowStockLimit}</dd>
              </div>
              {product.stock <= product.lowStockLimit && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  Stock is at or below the low stock limit.
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
