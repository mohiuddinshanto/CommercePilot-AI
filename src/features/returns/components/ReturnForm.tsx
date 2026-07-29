"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Minus, Trash2, Search, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CreateReturnInput } from "@/types/return";
import type { Sale } from "@/types/sale";
import { ReturnReasonSelector } from "./ReturnReasonSelector";

interface ReturnItemData {
  productId?: string;
  bundleId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
  soldQuantity: number;
}

interface ReturnFormProps {
  onSubmit: (data: CreateReturnInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onSearchInvoice: (invoiceNumber: string) => void;
  sale: Sale | null;
  isSearching: boolean;
}

export function ReturnForm({
  onSubmit,
  onCancel,
  isLoading,
  onSearchInvoice,
  sale,
  isSearching,
}: ReturnFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [items, setItems] = useState<ReturnItemData[]>([]);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!invoiceNumber.trim()) {
      onSearchInvoice("");
      return;
    }
    searchTimer.current = setTimeout(() => {
      onSearchInvoice(invoiceNumber.trim());
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [invoiceNumber, onSearchInvoice]);

  const addItem = (item: ReturnItemData) => {
    const existing = items.find(
      (i) =>
        (item.productId && i.productId === item.productId) ||
        (item.bundleId && i.bundleId === item.bundleId)
    );

    if (existing) {
      setItems(
        items.map((i) =>
          (item.productId && i.productId === item.productId) ||
          (item.bundleId && i.bundleId === item.bundleId)
            ? { ...i, quantity: i.quantity + 1, refundAmount: (i.quantity + 1) * i.unitPrice }
            : i
        )
      );
    } else {
      setItems([...items, { ...item, quantity: 1, refundAmount: item.unitPrice }]);
    }
  };

  const updateItemQty = (index: number, delta: number) => {
    const updated = [...items];
    const newQty = updated[index].quantity + delta;
    if (newQty >= 1 && newQty <= updated[index].soldQuantity) {
      updated[index] = {
        ...updated[index],
        quantity: newQty,
        refundAmount: newQty * updated[index].unitPrice,
      };
      setItems(updated);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.refundAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale || items.length === 0 || !reason) return;

    onSubmit({
      saleId: sale._id,
      items: items.map((item) => ({
        productId: item.productId,
        bundleId: item.bundleId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        refundAmount: item.refundAmount,
      })),
      reason,
      notes: notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Invoice Number *</label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Type invoice number to search..."
          />
          {invoiceNumber && (
            <button
              type="button"
              onClick={() => { setInvoiceNumber(""); setItems([]); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-1 text-xs text-blue-600">Searching invoice...</p>
        )}
      </div>

      {sale && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-800">
            Sale found: {sale.invoiceNumber} - {sale.customerName}{sale.customerPhone ? ` (${sale.customerPhone})` : ""} ({sale.items.length} items, Total: {formatCurrency(sale.grandTotal)})
          </p>
          <div className="mt-2 space-y-1">
            {sale.items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  addItem({
                    productId: item.productId,
                    bundleId: item.bundleId,
                    name: item.name,
                    quantity: 1,
                    unitPrice: item.unitPrice,
                    refundAmount: item.unitPrice,
                    soldQuantity: item.quantity,
                  })
                }
                className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-gray-500">({item.sku})</span>
                  <span className="ml-2 text-gray-500">Sold: {item.quantity}</span>
                </div>
                <span className="text-gray-600">{formatCurrency(item.unitPrice)} each</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Trash2 className="h-4 w-4" />
            Return Items ({items.length})
          </div>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500">/ {item.soldQuantity} sold</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItemQty(index, -1)}
                  disabled={item.quantity <= 1}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQty(index, 1)}
                  disabled={item.quantity >= item.soldQuantity}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="w-20 text-right text-sm font-medium text-red-600">
                  {formatCurrency(item.refundAmount)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReturnReasonSelector value={reason} onChange={setReason} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Optional notes about this return"
        />
      </div>

      {items.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-1">
            <span>Total Refund</span>
            <span className="text-red-600">{formatCurrency(subtotal)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || items.length === 0 || !reason}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Create Return"}
        </button>
      </div>
    </form>
  );
}
