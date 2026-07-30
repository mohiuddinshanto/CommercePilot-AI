"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReturn, useDeleteReturn, useUpdateReturn } from "@/features/returns/hooks/useReturns";
import { ReturnItems } from "@/features/returns/components/ReturnItems";
import { RefundSummary } from "@/features/returns/components/RefundSummary";
import { ErrorPage } from "@/components/common/ErrorPage";
import { useT } from "@/lib/i18n/use-t";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { RotateCcw, ArrowLeft, Trash2, RefreshCw, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function getReturnTypeLabel(type: string) {
  switch (type) {
    case "refund": return "Refund";
    case "same_exchange": return "Same Product Exchange";
    case "different_exchange": return "Different Product Exchange";
    default: return type;
  }
}

function getReturnTypeBadge(type: string) {
  switch (type) {
    case "refund": return "bg-purple-100 text-purple-700";
    case "same_exchange": return "bg-cyan-100 text-cyan-700";
    case "different_exchange": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const T = useT();
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
    return <ErrorPage title={T("returns.errorTitle", "Failed to load return")} message={T("returns.errorDetailMessage", "Could not fetch return details.")} />;
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
            <h1 className="text-2xl font-bold text-gray-900">{T("returns.returnWithNumber", "Return {invoice}").replace("{invoice}", returnDoc.invoiceNumber)}</h1>
            <p className="text-sm text-gray-500">
              {T("returns.created", "Created")} {formatDateTime(returnDoc.createdAt)}
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

          {returnDoc.returnType === "different_exchange" && returnDoc.exchangeItems && returnDoc.exchangeItems.length > 0 && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <RefreshCw className="h-5 w-5 text-orange-600" />
                {T("returns.exchangeItems")}
              </h2>
              <div className="space-y-2">
                {returnDoc.exchangeItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-orange-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-orange-700">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-sm border-t border-orange-200 pt-2">
                <span className="font-medium text-gray-700">{T("returns.exchangeTotal", "Exchange Total")}</span>
                <span className="font-semibold text-orange-700">{formatCurrency(returnDoc.exchangeTotal || 0)}</span>
              </div>
              {returnDoc.adjustmentAmount !== undefined && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-medium text-gray-700">{T("returns.adjustment", "Adjustment")}</span>
                  <span className={`font-semibold ${returnDoc.adjustmentAmount >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {returnDoc.adjustmentAmount >= 0
                      ? `Customer pays ${formatCurrency(returnDoc.adjustmentAmount)}`
                      : `Refund ${formatCurrency(Math.abs(returnDoc.adjustmentAmount))}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <RefundSummary returnDoc={returnDoc} />

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{T("common.status")}</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("returns.type")}</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getReturnTypeBadge(returnDoc.returnType)}`}
                  >
                    {getReturnTypeLabel(returnDoc.returnType)}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("returns.returnStatus", "Return Status")}</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getReturnStatusBadge(returnDoc.status)}`}
                  >
                    {returnDoc.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("sales.customer")}</dt>
                <dd className="text-sm text-gray-900 text-right">{returnDoc.customerName}{returnDoc.customerPhone ? <span className="block text-xs text-gray-400">{returnDoc.customerPhone}</span> : null}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("common.invoice")}</dt>
                <dd className="text-sm text-gray-900 font-mono">{returnDoc.invoiceNumber}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{T("common.metadata", "Metadata")}</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("common.created", "Created")}</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(returnDoc.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">{T("common.updated", "Updated")}</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(returnDoc.updatedAt)}</dd>
              </div>
              {returnDoc.notes && (
                <div>
                  <dt className="text-sm text-gray-500">{T("common.notes")}</dt>
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
