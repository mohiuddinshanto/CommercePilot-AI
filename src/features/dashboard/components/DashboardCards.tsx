"use client";

import {
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCards({ data }: { data: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Today's Sales"
        value={formatCurrency(data.todaySales)}
        icon={DollarSign}
        color="bg-green-500"
      />
      <StatCard
        title="Monthly Sales"
        value={formatCurrency(data.monthlySales)}
        icon={TrendingUp}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Products"
        value={formatNumber(data.totalProducts)}
        icon={Package}
        color="bg-purple-500"
      />
      <StatCard
        title="Low Stock Alert"
        value={formatNumber(data.lowStockCount)}
        icon={AlertTriangle}
        color="bg-yellow-500"
      />
      <StatCard
        title="Dead Stock"
        value={formatNumber(data.deadStockCount)}
        icon={AlertTriangle}
        color="bg-red-500"
      />
      <StatCard
        title="Total Customers"
        value={formatNumber(data.totalCustomers)}
        icon={Users}
        color="bg-indigo-500"
      />
    </div>
  );
}

export function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
