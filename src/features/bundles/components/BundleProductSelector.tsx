"use client";

import type { BundleProduct } from "@/types/bundle";
import { Plus, Trash2 } from "lucide-react";

interface BundleProductSelectorProps {
  products: BundleProduct[];
  onChange: (products: BundleProduct[]) => void;
  disabled?: boolean;
}

export function BundleProductSelector({
  products,
  onChange,
  disabled,
}: BundleProductSelectorProps) {
  const addProduct = () => {
    onChange([...products, { productId: "", quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    onChange(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: "productId" | "quantity", value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Products <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addProduct}
          disabled={disabled}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 && (
        <p className="text-sm text-gray-500 italic">No products added yet.</p>
      )}

      {products.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item.productId}
            onChange={(e) => updateProduct(index, "productId", e.target.value)}
            disabled={disabled}
            placeholder="Product ID"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateProduct(index, "quantity", Number(e.target.value))}
            disabled={disabled}
            min="1"
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeProduct(index)}
            disabled={disabled}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
