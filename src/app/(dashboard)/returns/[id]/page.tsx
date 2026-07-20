"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReturn, useDeleteReturn, useUpdateReturn } from "@/features/returns/hooks/useReturns";
import { ReturnItems } from "@/features/returns/components/ReturnItems";
import { RefundSummary } from "@/features/returns/components/RefundSummary";
import { ErrorPage } from "@/components/common/ErrorPage";
import { formatDateTime } from "@/lib/utils";
import { RotateCcw, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: returnDoc, isLoading, error } = useReturn(id);
  const deleteReturn = useDeleteReturn();
  const updateReturn = useUpdateReturn();

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this return?")) return;
    try {
      await deleteReturn.mutateAsync(id);
      toast.success("Return deleted.");
      router.push("/returns");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete return.");
    }
  }, [deleteReturn, id, router]);

  const handleStatusUpdate = useCallback(async (status: string) => {
    try {
      await updateReturn.mutateAsync({ id, input: { status } });
      toast.success(`Return ${status}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update return.");
    }
  }, [updateReturn, id]);

  if (error) {
    return <ErrorPage title="Failed to load return" message="Could not fetch return details." />;
  }

  if (isLoading || !returnDoc) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  function getReturnStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/returns"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <RotateCcw className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Return {returnDoc.invoiceNumber}</h1>
            <p className="text-sm text-gray-500">
              Created {formatDateTime(returnDoc.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {returnDoc.status === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate("approved")}
                className="flex items-center gap-2 rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Reject
              </button>
            </>
          )}
          {returnDoc.status === "approved" && (
            <button
              onClick={() => handleStatusUpdate("completed")}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Complete
            </button>
          )}
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
          <ReturnItems items={returnDoc.items} />
        </div>

        <div className="space-y-6">
          <RefundSummary returnDoc={returnDoc} />

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Return Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getReturnStatusBadge(returnDoc.status)}`}
                  >
                    {returnDoc.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Customer</dt>
                <dd className="text-sm text-gray-900">{returnDoc.customerName}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Invoice #</dt>
                <dd className="text-sm text-gray-900 font-mono">{returnDoc.invoiceNumber}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(returnDoc.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(returnDoc.updatedAt)}</dd>
              </div>
              {returnDoc.notes && (
                <div>
                  <dt className="text-sm text-gray-500">Notes</dt>
                  <dd className="text-sm text-gray-900 mt-1">{returnDoc.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
