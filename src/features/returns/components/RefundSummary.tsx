"use client";

import { formatCurrency } from "@/lib/utils";
import type { Return } from "@/types/return";

interface RefundSummaryProps {
  returnDoc: Return;
}

export function RefundSummary({ returnDoc }: RefundSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Summary</h2>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Subtotal</dt>
          <dd className="text-sm text-gray-900">{formatCurrency(returnDoc.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <dt className="text-sm font-medium text-gray-700">Total Refund</dt>
          <dd className="text-base font-semibold text-red-600">{formatCurrency(returnDoc.refundAmount)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Items Returned</dt>
          <dd className="text-sm text-gray-900">{returnDoc.items.length}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-500">Reason</dt>
          <dd className="text-sm text-gray-900">{returnDoc.reason || "-"}</dd>
        </div>
      </dl>
    </div>
  );
}
