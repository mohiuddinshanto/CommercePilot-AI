"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBundle, useDeleteBundle, useBundleStock } from "@/features/bundles/hooks/useBundles";
import { BundlePriceSummary } from "@/features/bundles/components/BundlePriceSummary";
import { ErrorPage } from "@/components/common/ErrorPage";
import { formatDateTime } from "@/lib/utils";
import { Package, ArrowLeft, Trash2, Edit, ShoppingCart, Tag, Box } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BundleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: bundle, isLoading, error } = useBundle(id);
  const { data: stock } = useBundleStock(id);
  const deleteBundle = useDeleteBundle();

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await deleteBundle.mutateAsync(id);
      toast.success("Bundle deleted.");
      router.push("/bundles");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete bundle.");
    }
  }, [deleteBundle, id, router]);

  if (error) {
    return <ErrorPage title="Failed to load bundle" message="Could not fetch bundle details." />;
  }

  if (isLoading || !bundle) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/bundles"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bundle.name}</h1>
            <p className="text-sm text-gray-500">
              Created {formatDateTime(bundle.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/bundles/${id}/edit`}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      bundle.status === "active"
                        ? "bg-green-100 text-green-800"
                        : bundle.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {bundle.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900">{bundle.slug}</dd>
              </div>
              {bundle.description && (
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bundle.description}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Products ({bundle.products.length})
              </div>
            </h2>
            <div className="space-y-2">
              {bundle.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      {item.productId.slice(0, 12)}...
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Pricing
              </div>
            </h2>
            <BundlePriceSummary
              originalPrice={bundle.originalPrice}
              bundlePrice={bundle.bundlePrice}
              discountAmount={bundle.discountAmount}
              discountPercentage={bundle.discountPercentage}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Stock
              </div>
            </h2>
            {stock && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Bundle Stock</span>
                <span
                  className={`text-lg font-semibold ${
                    stock.availableStock === 0
                      ? "text-red-600"
                      : stock.availableStock <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {stock.availableStock}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(bundle.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(bundle.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
