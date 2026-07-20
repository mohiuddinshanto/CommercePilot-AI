"use client";

import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-xs text-gray-400">{product.sku}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(product.status)}`}
        >
          {product.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">Cost</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(product.costPrice)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Price</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(product.sellingPrice)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Stock</p>
          <p
            className={`text-sm font-medium ${
              product.stock <= product.lowStockLimit ? "text-red-600" : "text-gray-900"
            }`}
          >
            {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
}
