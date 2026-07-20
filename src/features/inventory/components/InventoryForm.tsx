"use client";

import { useState } from "react";
import type { Inventory, CreateInventoryInput, UpdateInventoryInput } from "@/types/inventory";

interface InventoryFormProps {
  inventory?: Inventory;
  onSubmit: (data: CreateInventoryInput | UpdateInventoryInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InventoryForm({ inventory, onSubmit, onCancel, isLoading }: InventoryFormProps) {
  const [productId, setProductId] = useState(inventory?.productId || "");
  const [currentStock, setCurrentStock] = useState(inventory?.currentStock?.toString() || "0");
  const [lowStockLimit, setLowStockLimit] = useState(inventory?.lowStockLimit?.toString() || "10");
  const [costPrice, setCostPrice] = useState(inventory?.costPrice?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inventory) {
      const data: UpdateInventoryInput = {
        currentStock: Number(currentStock),
        lowStockLimit: Number(lowStockLimit),
        costPrice: Number(costPrice),
      };
      onSubmit(data);
    } else {
      const data: CreateInventoryInput = {
        productId,
        currentStock: Number(currentStock),
        lowStockLimit: Number(lowStockLimit),
        costPrice: Number(costPrice),
      };
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!inventory && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter product ID"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            min="0"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Low Stock Limit</label>
          <input
            type="number"
            value={lowStockLimit}
            onChange={(e) => setLowStockLimit(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cost Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="0.00"
        />
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
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : inventory ? "Update Inventory" : "Create Inventory"}
        </button>
      </div>
    </form>
  );
}
