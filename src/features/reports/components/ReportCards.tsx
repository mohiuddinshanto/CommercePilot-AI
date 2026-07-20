"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function SalesReportCards({
  totalSales,
  totalRevenue,
  avgSaleValue,
  completedSales,
  totalPaid,
  totalDue,
}: {
  totalSales: number;
  totalRevenue: number;
  avgSaleValue: number;
  completedSales: number;
  totalPaid: number;
  totalDue: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Sales"
        value={formatNumber(totalSales)}
        icon={ShoppingCart}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={DollarSign}
        color="bg-green-500"
      />
      <StatCard
        title="Avg Sale Value"
        value={formatCurrency(avgSaleValue)}
        icon={TrendingUp}
        color="bg-purple-500"
      />
      <StatCard
        title="Completed Sales"
        value={formatNumber(completedSales)}
        icon={ShoppingCart}
        color="bg-emerald-500"
      />
      <StatCard
        title="Total Paid"
        value={formatCurrency(totalPaid)}
        icon={DollarSign}
        color="bg-teal-500"
      />
      <StatCard
        title="Total Due"
        value={formatCurrency(totalDue)}
        icon={AlertTriangle}
        color={totalDue > 0 ? "bg-red-500" : "bg-gray-400"}
      />
    </div>
  );
}

export function InventoryReportCards({
  totalProducts,
  totalStockUnits,
  totalInventoryValue,
  lowStockCount,
  outOfStockCount,
}: {
  totalProducts: number;
  totalStockUnits: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Products"
        value={formatNumber(totalProducts)}
        icon={Package}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Stock Units"
        value={formatNumber(totalStockUnits)}
        icon={Package}
        color="bg-purple-500"
      />
      <StatCard
        title="Inventory Value"
        value={formatCurrency(totalInventoryValue)}
        icon={DollarSign}
        color="bg-green-500"
      />
      <StatCard
        title="Low Stock Items"
        value={formatNumber(lowStockCount)}
        icon={AlertTriangle}
        color="bg-yellow-500"
      />
      <StatCard
        title="Out of Stock"
        value={formatNumber(outOfStockCount)}
        icon={AlertTriangle}
        color="bg-red-500"
      />
    </div>
  );
}

export function ProfitReportCards({
  totalRevenue,
  totalCost,
  totalProfit,
  profitMargin,
}: {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={DollarSign}
        color="bg-green-500"
      />
      <StatCard
        title="Total Cost"
        value={formatCurrency(totalCost)}
        icon={TrendingUp}
        color="bg-orange-500"
      />
      <StatCard
        title="Total Profit"
        value={formatCurrency(totalProfit)}
        icon={DollarSign}
        color={totalProfit >= 0 ? "bg-emerald-500" : "bg-red-500"}
      />
      <StatCard
        title="Profit Margin"
        value={`${profitMargin}%`}
        icon={TrendingUp}
        color={profitMargin >= 0 ? "bg-teal-500" : "bg-red-500"}
      />
    </div>
  );
}
