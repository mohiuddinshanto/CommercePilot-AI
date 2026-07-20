"use client";

import { formatCurrency } from "@/lib/utils";
import type { ReturnItem } from "@/types/return";

interface ReturnItemsProps {
  items: ReturnItem[];
}

export function ReturnItems({ items }: ReturnItemsProps) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No items in this return.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Returned Items</h3>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2 font-medium text-gray-600">Item</th>
              <th className="px-4 py-2 font-medium text-gray-600">Type</th>
              <th className="px-4 py-2 font-medium text-gray-600">Qty</th>
              <th className="px-4 py-2 font-medium text-gray-600">Unit Price</th>
              <th className="px-4 py-2 font-medium text-gray-600">Refund</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-4 py-2 text-gray-900">
                  {item.productId ? `Product ${item.productId.slice(-6)}` : `Bundle ${item.bundleId?.slice(-6)}`}
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.productId ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                    {item.productId ? "Product" : "Bundle"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">{item.quantity}</td>
                <td className="px-4 py-2 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                <td className="px-4 py-2 font-medium text-red-600">{formatCurrency(item.refundAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
