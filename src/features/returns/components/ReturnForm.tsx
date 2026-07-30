"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Minus, Trash2, Search, X, Package } from "lucide-react";
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
  onSearchSales: (query: string) => void;
  sales: Sale[];
  selectedSale: Sale | null;
  onSelectSale: (sale: Sale | null) => void;
  isSearching: boolean;
}

export function ReturnForm({
  onSubmit,
  onCancel,
  isLoading,
  onSearchSales,
  sales,
  selectedSale,
  onSelectSale,
  isSearching,
}: ReturnFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<ReturnItemData[]>([]);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // don't close on outside click
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      onSelectSale(null);
      onSearchSales("");
      return;
    }
    searchTimer.current = setTimeout(() => {
      onSearchSales(searchQuery.trim());
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery, onSearchSales, onSelectSale]);

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
    if (!selectedSale || items.length === 0 || !reason) return;

    onSubmit({
      saleId: selectedSale._id,
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
      <div ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700">Search Sale *</label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedSale) onSelectSale(null);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search by invoice, customer name, or phone..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setItems([]); onSelectSale(null); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {searchQuery && !selectedSale && (
          <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md">
            {isSearching ? (
              <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mr-2" />
                Searching...
              </div>
            ) : sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-gray-500">
                <Package className="h-7 w-7 mb-1 text-gray-400" />
                No sales found
              </div>
            ) : (
              sales.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => { onSelectSale(s); setSearchQuery(`${s.invoiceNumber} - ${s.customerName}`); }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{s.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">
                      {s.customerName}{s.customerPhone ? ` - ${s.customerPhone}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gray-700">
                    {formatCurrency(s.grandTotal)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected sale banner with items */}
      {selectedSale && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-800">
              Sale: {selectedSale.invoiceNumber} - {selectedSale.customerName}{selectedSale.customerPhone ? ` (${selectedSale.customerPhone})` : ""} ({selectedSale.items.length} items, Total: {formatCurrency(selectedSale.grandTotal)})
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setItems([]); onSelectSale(null); }}
              className="text-xs text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>
          <div className="mt-1 space-y-1">
            {selectedSale.items.map((item, index) => (
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
