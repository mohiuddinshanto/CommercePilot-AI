"use client";

import { useT } from "@/lib/i18n/use-t";
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

export function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
  const T = useT();

  function getMovementLabel(type: string) {
    switch (type) {
      case "stock_in":
        return <span className="text-green-700">{T("inventory.stockIn")}</span>;
      case "stock_out":
        return <span className="text-red-700">{T("inventory.stockOut")}</span>;
      case "adjustment":
        return <span className="text-blue-700">{T("inventory.adjust")}</span>;
      default:
        return <span>{type}</span>;
    }
  }

  if (movements.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">{T("inventory.noMovements")}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.type")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.quantity")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.previous")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.new")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.reference")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("inventory.notes")}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{T("common.date")}</th>
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
