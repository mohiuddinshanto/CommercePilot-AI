"use client";

import { useState } from "react";
import { SalesModal } from "@/features/sales/components/SalesModal";
import { useCreateShipment } from "../hooks/useShipments";
import { COURIER_NAMES } from "@/constants/shipment";
import toast from "react-hot-toast";

interface SendToCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
  customerName: string;
  customerPhone: string;
  defaultCodAmount: number;
}

interface CourierOption {
  value: string;
  label: string;
}

const courierOptions: CourierOption[] = [
  { value: COURIER_NAMES.STEADFAST, label: "Steadfast" },
  { value: COURIER_NAMES.PATHAO, label: "Pathao" },
  { value: COURIER_NAMES.REDX, label: "RedX" },
  { value: COURIER_NAMES.ECOURIER, label: "eCourier" },
  { value: COURIER_NAMES.MANUAL, label: "Manual" },
];

export function SendToCourierModal({
  isOpen,
  onClose,
  saleId,
  customerName,
  customerPhone,
  defaultCodAmount,
}: SendToCourierModalProps) {
  const [courier, setCourier] = useState(courierOptions[0].value);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState(customerPhone);
  const [codAmount, setCodAmount] = useState(defaultCodAmount);
  const createShipment = useCreateShipment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createShipment.mutateAsync({
        saleId,
        courier,
        deliveryAddress,
        deliveryPhone,
        codAmount,
      });
      toast.success("Shipment created successfully.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create shipment.");
    }
  };

  return (
    <SalesModal title="Send to Courier" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
          <select
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            {courierOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={customerName}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Phone</label>
          <input
            type="text"
            value={deliveryPhone}
            onChange={(e) => setDeliveryPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">COD Amount</label>
          <input
            type="number"
            value={codAmount}
            onChange={(e) => setCodAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            min={0}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createShipment.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createShipment.isPending ? "Creating..." : "Send to Courier"}
          </button>
        </div>
      </form>
    </SalesModal>
  );
}
