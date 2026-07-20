"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSale, useDeleteSale } from "@/features/sales/hooks/useSales";
import { InvoicePreview } from "@/features/sales/components/InvoicePreview";
import { ErrorPage } from "@/components/common/ErrorPage";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { Receipt, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: sale, isLoading, error } = useSale(id);
  const deleteSale = useDeleteSale();

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSale.mutateAsync(id);
      toast.success("Sale deleted.");
      router.push("/sales");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete sale.");
    }
  }, [deleteSale, id, router]);

  if (error) {
    return <ErrorPage title="Failed to load sale" message="Could not fetch sale details." />;
  }

  if (isLoading || !sale) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  function getPaymentStatusBadge(status: string) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "due":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getSaleStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/sales"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Receipt className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sale {sale.invoiceNumber}</h1>
            <p className="text-sm text-gray-500">
              Created {formatDateTime(sale.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          <InvoicePreview sale={sale} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Sale Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSaleStatusBadge(sale.status)}`}
                  >
                    {sale.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Payment Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentStatusBadge(sale.paymentStatus)}`}
                  >
                    {sale.paymentStatus}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Payment Method</dt>
                <dd className="text-sm text-gray-900 capitalize">
                  {sale.paymentMethod.replace("_", " ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Grand Total</dt>
                <dd className="text-sm font-semibold text-gray-900">{formatCurrency(sale.grandTotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Paid Amount</dt>
                <dd className="text-sm text-green-600">{formatCurrency(sale.paidAmount)}</dd>
              </div>
              {sale.dueAmount > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Due Amount</dt>
                  <dd className="text-sm text-red-600">{formatCurrency(sale.dueAmount)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(sale.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(sale.updatedAt)}</dd>
              </div>
              {sale.invoiceNumber && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Invoice #</dt>
                  <dd className="text-sm text-gray-900 font-mono">{sale.invoiceNumber}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
