"use client";

import { formatCurrency } from "@/lib/utils";
import { Tag, Percent, ShoppingCart } from "lucide-react";

interface BundlePriceSummaryProps {
  originalPrice: number;
  bundlePrice: number;
  discountAmount: number;
  discountPercentage: number;
}

export function BundlePriceSummary({
  originalPrice,
  bundlePrice,
  discountAmount,
  discountPercentage,
}: BundlePriceSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Price Summary</h4>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShoppingCart className="h-4 w-4" />
          Original Price
        </div>
        <span className="text-sm text-gray-600">{formatCurrency(originalPrice)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag className="h-4 w-4" />
          Bundle Price
        </div>
        <span className="text-sm font-medium text-gray-900">{formatCurrency(bundlePrice)}</span>
      </div>

      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Percent className="h-4 w-4" />
            You Save
          </div>
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(discountAmount)} ({discountPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
