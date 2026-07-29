"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Search, Package, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { CreateSaleInput } from "@/types/sale";
import type { Product } from "@/types/product";

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

  // Product search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: productsData, isLoading: isSearching } = useProducts({
    search: searchQuery || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    limit: 30,
    status: "active",
  });

  const cartedIds = new Set(items.map((i) => i.productId));
  const products = (productsData?.items || []).filter((p) => !cartedIds.has(p._id));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addProductToCart = (product: Product) => {
    // Check if already in cart → increment qty
    const existingIdx = items.findIndex((i) => i.productId === product._id);
    if (existingIdx !== -1) {
      const updated = [...items];
      updated[existingIdx] = {
        ...updated[existingIdx],
        quantity: updated[existingIdx].quantity + 1,
      };
      setItems(updated);
    } else {
      const newItem: CartItemData = {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unitPrice: product.discountPrice || product.sellingPrice,
      };
      setItems([...items, newItem]);
    }
    // Keep search open so user can add more
    searchInputRef.current?.focus();
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

  const updateItemPrice = (index: number, price: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], unitPrice: Number(price) || 0 };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountNum = Number(discount) || 0;
  const taxNum = Number(tax) || 0;
  const shippingNum = Number(shipping) || 0;
  const grandTotal = Math.max(0, subtotal - discountNum + taxNum + shippingNum);
  const paidNum = Number(paidAmount) || 0;

  // Auto-fill paid amount with grand total when it changes (if still at 0)
  useEffect(() => {
    if (paidAmount === "0" || paidAmount === "") {
      setPaidAmount(grandTotal.toFixed(2));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandTotal]);

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
      {/* Customer Info */}
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

      {/* ── Product Search Browser ── */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3" ref={dropdownRef}>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-blue-700">
          <Package className="h-4 w-4" />
          Search & Add Products
        </p>

        {/* Search + Price Filter Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search product by name..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setIsDropdownOpen(true); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">৳</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setIsDropdownOpen(true); }}
                placeholder="Min"
                min="0"
                className="w-20 rounded-lg border border-gray-300 bg-white py-2 pl-5 pr-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <span className="text-gray-400 text-xs">–</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">৳</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setIsDropdownOpen(true); }}
                placeholder="Max"
                min="0"
                className="w-20 rounded-lg border border-gray-300 bg-white py-2 pl-5 pr-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Product Dropdown */}
        {isDropdownOpen && (
          <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md">
            {isSearching ? (
              <div className="flex items-center justify-center py-6 text-sm text-gray-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mr-2" />
                Searching...
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-gray-400">
                <Package className="h-7 w-7 mb-1 text-gray-300" />
                No products found
              </div>
            ) : (
              products.map((product) => {
                const price = product.discountPrice || product.sellingPrice;
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => addProductToCart(product)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-9 w-9 rounded-md object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        SKU: {product.sku}
                        {product.discountPrice && (
                          <span className="ml-2 line-through text-gray-400">
                            ৳{product.sellingPrice?.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-blue-700">
                        ৳{price?.toLocaleString()}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 flex items-center gap-0.5">
                        <Plus className="h-3 w-3" /> Add
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        <p className="mt-1.5 text-xs text-blue-600/70">
          {items.length > 0
            ? `${items.length} product(s) in cart`
            : "Select products to add to cart"}
        </p>
      </div>

      {/* Cart Items */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ShoppingCart className="h-4 w-4" />
            Cart ({items.length} items)
          </div>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sku}</p>
              </div>

              {/* Editable unit price */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">৳</span>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItemPrice(index, e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-20 rounded-md border border-gray-200 px-2 py-1 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateItemQty(index, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQty(index, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <span className="w-24 text-right text-sm font-semibold text-gray-800">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-md p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (৳)</label>
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
            <label className="block text-sm font-medium text-gray-700">Tax (৳)</label>
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
            <label className="block text-sm font-medium text-gray-700">Shipping (৳)</label>
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
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
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

      {/* Order Summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {discountNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Discount</span>
            <span className="text-red-600 font-medium">−{formatCurrency(discountNum)}</span>
          </div>
        )}
        {taxNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span>+{formatCurrency(taxNum)}</span>
          </div>
        )}
        {shippingNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span>+{formatCurrency(shippingNum)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold">
          <span>Grand Total</span>
          <span className="text-blue-700">{formatCurrency(grandTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Paid</span>
          <span className="text-green-600 font-medium">{formatCurrency(paidNum)}</span>
        </div>
        {grandTotal - paidNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Due</span>
            <span className="text-red-600 font-bold">{formatCurrency(grandTotal - paidNum)}</span>
          </div>
        )}
        {paidNum > grandTotal && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Change</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(paidNum - grandTotal)}</span>
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
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : `Complete Sale — ${formatCurrency(grandTotal)}`}
        </button>
      </div>
    </form>
  );
}
