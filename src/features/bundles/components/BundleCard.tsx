"use client";

import type { Bundle } from "@/types/bundle";
import { formatCurrency } from "@/lib/utils";
import { Package, Tag, ShoppingCart, Percent } from "lucide-react";

interface BundleCardProps {
  bundle: Bundle;
  onClick?: () => void;
}

export function BundleCard({ bundle, onClick }: BundleCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-blue-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
            {bundle.description && (
              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                {bundle.description}
              </p>
            )}
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            bundle.status === "active"
              ? "bg-green-100 text-green-800"
              : bundle.status === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {bundle.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <ShoppingCart className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Products</p>
            <p className="text-sm font-medium text-gray-900">{bundle.products.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Bundle Price</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(bundle.bundlePrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">
            Save {bundle.discountPercentage.toFixed(1)}%
          </span>
        </div>
        <span className="text-sm font-medium text-green-700">
          {formatCurrency(bundle.discountAmount)} off
        </span>
      </div>
    </div>
  );
}
