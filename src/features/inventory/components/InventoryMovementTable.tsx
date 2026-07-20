"use client";

import { formatDateTime } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Settings } from "lucide-react";
import type { InventoryMovement } from "@/types/inventory";

interface InventoryMovementTableProps {
  movements: InventoryMovement[];
}

function getMovementIcon(type: string) {
  switch (type) {
    case "stock_in":
      return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
    case "stock_out":
      return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
    case "adjustment":
      return <Settings className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
}

function getMovementLabel(type: string) {
  switch (type) {
    case "stock_in":
      return <span className="text-green-700">Stock In</span>;
    case "stock_out":
      return <span className="text-red-700">Stock Out</span>;
    case "adjustment":
      return <span className="text-blue-700">Adjustment</span>;
    default:
      return <span>{type}</span>;
  }
}

export function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
  if (movements.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">No movement history found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-medium text-gray-600">Type</th>
            <th className="px-4 py-3 font-medium text-gray-600">Quantity</th>
            <th className="px-4 py-3 font-medium text-gray-600">Previous</th>
            <th className="px-4 py-3 font-medium text-gray-600">New</th>
            <th className="px-4 py-3 font-medium text-gray-600">Reference</th>
            <th className="px-4 py-3 font-medium text-gray-600">Notes</th>
            <th className="px-4 py-3 font-medium text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {getMovementIcon(m.type)}
                  {getMovementLabel(m.type)}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{m.quantity}</td>
              <td className="px-4 py-3 text-gray-600">{m.previousStock}</td>
              <td className="px-4 py-3 text-gray-600">{m.newStock}</td>
              <td className="px-4 py-3 text-gray-600">{m.reference || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{m.notes || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{formatDateTime(m.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
