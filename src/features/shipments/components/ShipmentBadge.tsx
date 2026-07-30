"use client";

import { SHIPMENT_STATUS, COURIER_NAMES } from "@/constants/shipment";

const statusConfig: Record<string, { label: string; color: string }> = {
  [SHIPMENT_STATUS.PENDING]: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  [SHIPMENT_STATUS.PICKED]: { label: "Picked", color: "bg-blue-100 text-blue-800" },
  [SHIPMENT_STATUS.IN_TRANSIT]: { label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  [SHIPMENT_STATUS.DELIVERED]: { label: "Delivered", color: "bg-green-100 text-green-800" },
  [SHIPMENT_STATUS.RETURNED]: { label: "Returned", color: "bg-orange-100 text-orange-800" },
  [SHIPMENT_STATUS.CANCELLED]: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export function ShipmentBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

const courierLabels: Record<string, string> = {
  [COURIER_NAMES.STEADFAST]: "Steadfast",
  [COURIER_NAMES.PATHAO]: "Pathao",
  [COURIER_NAMES.REDX]: "RedX",
  [COURIER_NAMES.ECOURIER]: "eCourier",
  [COURIER_NAMES.MANUAL]: "Manual",
};

export function getCourierLabel(courier: string): string {
  return courierLabels[courier] || courier;
}
