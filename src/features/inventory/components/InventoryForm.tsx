"use client";

import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n/use-t";
import { Search, Package, ChevronDown, X } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Inventory, CreateInventoryInput, UpdateInventoryInput } from "@/types/inventory";
import type { Product } from "@/types/product";

interface InventoryFormProps {
  inventory?: Inventory;
  onSubmit: (data: CreateInventoryInput | UpdateInventoryInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InventoryForm({ inventory, onSubmit, onCancel, isLoading }: InventoryFormProps) {
  const T = useT();
  const [productId, setProductId] = useState(inventory?.productId || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(inventory?.currentStock?.toString() || "0");
  const [lowStockLimit, setLowStockLimit] = useState(inventory?.lowStockLimit?.toString() || "10");
  const [costPrice, setCostPrice] = useState(inventory?.costPrice?.toString() || "0");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productsData } = useProducts({
    search: searchQuery || undefined,
    limit: 20,
    status: "active",
  });

  const products = productsData?.items || [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductId(product._id);
    setSearchQuery(product.name);
    if (!inventory) {
      setCostPrice(product.costPrice?.toString() || "0");
    }
    setIsDropdownOpen(false);
  };

  const handleClearProduct = () => {
    setSelectedProduct(null);
    setProductId("");
    setSearchQuery("");
  };

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
      {/* Product Search Dropdown */}
      {!inventory && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("inventory.form.selectProduct")}
          </label>
          <div ref={dropdownRef} className="relative mt-1">
            <div
              className={`flex items-center gap-2 w-full rounded-lg border px-3 py-2 text-sm bg-white transition-colors ${
                isDropdownOpen
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (!e.target.value) handleClearProduct();
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={T("inventory.form.searchProduct")}
                className="flex-1 bg-transparent outline-none placeholder-gray-400"
              />
              {selectedProduct ? (
                <button
                  type="button"
                  onClick={handleClearProduct}
                  className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
              )}
            </div>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-gray-400">
                    <Package className="h-8 w-8 mb-2 text-gray-300" />
                    <p>{T("inventory.form.noProducts")}</p>
                    <p className="text-xs mt-1">{T("inventory.form.tryDifferent")}</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        productId === product._id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-8 w-8 rounded-md object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{T("products.sku")}: {product.sku}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-blue-600">
                        ৳{product.sellingPrice?.toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected product badge */}
          {selectedProduct && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
              <Package className="h-4 w-4 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">{selectedProduct.name}</p>
                <p className="text-xs text-blue-600">SKU: {selectedProduct.sku}</p>
              </div>
              <span className="text-xs text-green-600 font-medium">{T("common.selected", "✓ Selected")}</span>
            </div>
          )}

          {/* Hidden required input to ensure product is selected */}
          <input
            type="text"
            value={productId}
            onChange={() => {}}
            required
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("inventory.form.currentStock")}
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
          <label className="block text-sm font-medium text-gray-700">{T("inventory.form.lowStockAlert")}</label>
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
          {T("inventory.form.costPrice")}
        </label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ৳
          </span>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            min="0"
            step="0.01"
            required
            className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        {selectedProduct && (
          <p className="mt-1 text-xs text-gray-400">
            {T("inventory.productCostPrice", "Product cost price")}: ৳{selectedProduct.costPrice?.toLocaleString()} ({T("common.change", "change")})
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {T("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isLoading || (!inventory && !productId)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? T("common.saving", "Saving...") : inventory ? T("inventory.edit") : T("inventory.add")}
        </button>
      </div>
    </form>
  );
}
