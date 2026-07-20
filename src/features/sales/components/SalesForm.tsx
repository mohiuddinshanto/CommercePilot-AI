"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CreateSaleInput } from "@/types/sale";

interface CartItemData {
  productId?: string;
  bundleId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

interface SalesFormProps {
  onSubmit: (data: CreateSaleInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SalesForm({ onSubmit, onCancel, isLoading }: SalesFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<CartItemData[]>([]);
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Quick add fields
  const [quickName, setQuickName] = useState("");
  const [quickSku, setQuickSku] = useState("");
  const [quickPrice, setQuickPrice] = useState("");
  const [quickQty, setQuickQty] = useState("1");

  const addItem = () => {
    if (!quickName || !quickPrice) return;
    const newItem: CartItemData = {
      name: quickName,
      sku: quickSku || `SKU-${Date.now()}`,
      quantity: Number(quickQty) || 1,
      unitPrice: Number(quickPrice),
    };
    setItems([...items, newItem]);
    setQuickName("");
    setQuickSku("");
    setQuickPrice("");
    setQuickQty("1");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemQty = (index: number, delta: number) => {
    const updated = [...items];
    const newQty = updated[index].quantity + delta;
    if (newQty >= 1) {
      updated[index] = { ...updated[index], quantity: newQty };
      setItems(updated);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountNum = Number(discount) || 0;
  const taxNum = Number(tax) || 0;
  const shippingNum = Number(shipping) || 0;
  const grandTotal = Math.max(0, subtotal - discountNum + taxNum + shippingNum);
  const paidNum = Number(paidAmount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    onSubmit({
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        bundleId: item.bundleId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      discount: discountNum,
      tax: taxNum,
      shipping: shippingNum,
      paidAmount: paidNum,
      paymentMethod,
      notes: notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Walk-in Customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Plus className="h-4 w-4" />
          Add Item
        </div>
        <div className="grid grid-cols-5 gap-2">
          <input
            type="text"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            placeholder="Name *"
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
          <input
            type="text"
            value={quickSku}
            onChange={(e) => setQuickSku(e.target.value)}
            placeholder="SKU"
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            value={quickPrice}
            onChange={(e) => setQuickPrice(e.target.value)}
            placeholder="Price *"
            min="0"
            step="0.01"
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            value={quickQty}
            onChange={(e) => setQuickQty(e.target.value)}
            min="1"
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ShoppingCart className="h-4 w-4" />
            Cart ({items.length} items)
          </div>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500">{item.sku}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItemQty(index, -1)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQty(index, 1)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="w-20 text-right text-sm font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax</label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping</label>
            <input
              type="number"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile_banking">Mobile Banking</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount *</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">-{formatCurrency(discountNum)}</span>
          </div>
        )}
        {taxNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>+{formatCurrency(taxNum)}</span>
          </div>
        )}
        {shippingNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>+{formatCurrency(shippingNum)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-1">
          <span>Grand Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paid</span>
          <span className="text-green-600">{formatCurrency(paidNum)}</span>
        </div>
        {grandTotal - paidNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Due</span>
            <span className="text-red-600">{formatCurrency(grandTotal - paidNum)}</span>
          </div>
        )}
      </div>

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
          disabled={isLoading || items.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Complete Sale"}
        </button>
      </div>
    </form>
  );
}
