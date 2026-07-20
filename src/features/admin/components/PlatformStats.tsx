"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Store,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { PlatformDashboard } from "../types/admin";

interface PlatformStatsProps {
  data: PlatformDashboard;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export function PlatformStats({ data }: PlatformStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Stores"
          value={formatNumber(data.totalStores)}
          icon={Store}
          color="bg-blue-600"
          subtitle={`${data.pendingStores} pending, ${data.activeStores} active`}
        />
        <StatCard
          label="Total Users"
          value={formatNumber(data.totalUsers)}
          icon={Users}
          color="bg-green-600"
          subtitle={`${data.totalStaff} staff members`}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={DollarSign}
          color="bg-purple-600"
          subtitle={`${formatCurrency(data.monthlyRevenue)} this month`}
        />
        <StatCard
          label="Total Sales"
          value={formatNumber(data.totalSales)}
          icon={ShoppingCart}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Products"
          value={formatNumber(data.totalProducts)}
          icon={Package}
          color="bg-teal-600"
        />
        <StatCard
          label="Subscriptions"
          value={formatNumber(data.totalSubscriptions)}
          icon={TrendingUp}
          color="bg-indigo-600"
        />
        <StatCard
          label="AI Conversations"
          value={formatNumber(data.totalAiConversations)}
          icon={Sparkles}
          color="bg-pink-600"
        />
        <StatCard
          label="Pending Stores"
          value={formatNumber(data.pendingStores)}
          icon={AlertTriangle}
          color={data.pendingStores > 0 ? "bg-red-600" : "bg-gray-400"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">Plan Breakdown</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Starter</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.starter}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Professional</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.pro}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Business</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.business}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">Store Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Active</span>
              <span className="text-sm font-medium text-green-600">
                {data.activeStores}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Pending</span>
              <span className="text-sm font-medium text-yellow-600">
                {data.pendingStores}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Suspended</span>
              <span className="text-sm font-medium text-red-600">
                {data.suspendedStores}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Products Listed</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(data.totalProducts)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Staff Members</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(data.totalStaff)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Monthly Revenue</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(data.monthlyRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
