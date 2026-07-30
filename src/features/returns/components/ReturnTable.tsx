"use client";

import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";
import { RotateCcw, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Return } from "@/types/return";

interface ReturnTableProps {
  items: Return[];
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

function getReturnTypeBadge(type: string) {
  switch (type) {
    case "refund":
      return "bg-purple-100 text-purple-700";
    case "same_exchange":
      return "bg-cyan-100 text-cyan-700";
    case "different_exchange":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getReturnTypeLabel(type: string, T: (k: string, f?: string) => string) {
  switch (type) {
    case "refund":
      return T("returns.refundShort", "Refund");
    case "same_exchange":
      return T("returns.sameExchShort", "Same Exch.");
    case "different_exchange":
      return T("returns.diffExchShort", "Diff. Exch.");
    default:
      return type;
  }
}

export function ReturnTable({
  items,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: ReturnTableProps) {
  const T = useT();
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white py-16">
        <RotateCcw className="h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-600">{T("returns.noReturns", "No returns found")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.invoice")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("sales.customer")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.type")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("sales.items")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("returns.refund")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.reason")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.status")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.date")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 font-mono text-xs">
                    {item.invoiceNumber}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-900">{item.customerName}</p>
                  {item.customerPhone && (
                    <p className="text-xs text-gray-500">{item.customerPhone}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getReturnTypeBadge(item.returnType)}`}
                  >
                    {getReturnTypeLabel(item.returnType, T)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.items.length}</td>
                <td className="px-4 py-3 font-medium text-red-600">
                  {formatCurrency(item.refundAmount)}
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">
                  {item.reason || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getReturnStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDateTime(item.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/returns/${item._id}`}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            {T("common.pageOf", "Page {page} of {total}").replace("{page}", String(page)).replace("{total}", String(totalPages))}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReturnTableSkeleton() {
  const T = useT();
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.invoice")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("sales.customer")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("sales.items")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("returns.refund")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.reason")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.status")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.date")}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{T("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
