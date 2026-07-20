"use client";

import { useState } from "react";
import { Plus, Minus, Trash2, Search } from "lucide-react";
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceNumber.trim()) {
      onSearchInvoice(invoiceNumber.trim());
    }
  };

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
        <form onSubmit={handleSearch} className="mt-1 flex gap-2">
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter invoice number (e.g., INV-20260719-0001)"
          />
          <button
            type="submit"
            disabled={isSearching || !invoiceNumber.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {sale && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-800">
            Sale found: {sale.invoiceNumber} - {sale.customerName} ({sale.items.length} items, Total: {formatCurrency(sale.grandTotal)})
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
