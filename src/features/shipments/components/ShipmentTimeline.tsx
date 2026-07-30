"use client";

import { useT } from "@/lib/i18n/use-t";
import { ShipmentBadge } from "./ShipmentBadge";
import { getCourierLabel } from "./ShipmentBadge";
import { formatDateTime } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle, RotateCcw, RefreshCw } from "lucide-react";
import type { Shipment } from "@/types/shipment";

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Package className="h-4 w-4" />,
  picked: <Truck className="h-4 w-4" />,
  in_transit: <RefreshCw className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  returned: <RotateCcw className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

interface ShipmentSectionProps {
  shipments: Shipment[];
}

export function ShipmentSection({ shipments }: ShipmentSectionProps) {
  const T = useT();
  if (!shipments.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{T("shipments.title", "Shipments")}</h2>
      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div key={shipment._id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {getCourierLabel(shipment.courier)}
                </span>
                <ShipmentBadge status={shipment.status} />
              </div>
              {shipment.consignmentId && (
                <span className="text-xs text-gray-500 font-mono">
                  {T("common.id")}: {shipment.consignmentId}
                </span>
              )}
            </div>

            {shipment.statusHistory && shipment.statusHistory.length > 1 && (
              <div className="mt-3 space-y-1">
                {[...shipment.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    {statusIcons[h.status] || <Package className="h-3 w-3" />}
                    <span className="capitalize">{h.status.replace("_", " ")}</span>
                    <span className="text-gray-400">{formatDateTime(h.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500">{T("shipments.cod", "COD")}: {shipment.codAmount} BDT</span>
              <span className="text-gray-500">
                {T("common.phone")}: {shipment.deliveryPhone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
