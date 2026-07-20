"use client";

import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { Package, Eye, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Inventory } from "@/types/inventory";

interface InventoryTableProps {
  items: Inventory[];
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getStockStatus(item: Inventory) {
  if (item.currentStock === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
  if (item.currentStock <= item.lowStockLimit) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
  return { label: "In Stock", className: "bg-green-100 text-green-800" };
}

export function InventoryTable({
  items,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white py-16">
        <Package className="h-12 w-12 text-gray-300" />
        <p className="text-sm text-gray-500">No inventory records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">Product ID</th>
              <th className="px-4 py-3 font-medium text-gray-600">Current Stock</th>
              <th className="px-4 py-3 font-medium text-gray-600">Available</th>
              <th className="px-4 py-3 font-medium text-gray-600">Low Stock Limit</th>
              <th className="px-4 py-3 font-medium text-gray-600">Cost Price</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Last Restocked</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 font-mono text-xs">
                      {item.productId.slice(0, 8)}...
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">{item.currentStock}</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.availableStock}</td>
                  <td className="px-4 py-3 text-gray-600">{item.lowStockLimit}</td>
                  <td className="px-4 py-3 text-gray-600">${item.costPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.lastRestockedAt ? formatDateTime(item.lastRestockedAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/inventory/${item._id}`}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/inventory/${item._id}/edit`}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
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
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
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

export function InventoryTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">Product ID</th>
              <th className="px-4 py-3 font-medium text-gray-600">Current Stock</th>
              <th className="px-4 py-3 font-medium text-gray-600">Available</th>
              <th className="px-4 py-3 font-medium text-gray-600">Low Stock Limit</th>
              <th className="px-4 py-3 font-medium text-gray-600">Cost Price</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Last Restocked</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
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
