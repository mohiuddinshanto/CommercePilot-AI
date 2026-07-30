"use client";

import { useT } from "@/lib/i18n/use-t";
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
  const T = useT();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={T("admin.totalStores")}
          value={formatNumber(data.totalStores)}
          icon={Store}
          color="bg-blue-600"
          subtitle={`${data.pendingStores} ${T("admin.pending")}, ${data.activeStores} ${T("admin.active")}`}
        />
        <StatCard
          label={T("admin.totalUsers")}
          value={formatNumber(data.totalUsers)}
          icon={Users}
          color="bg-green-600"
          subtitle={`${data.totalStaff} ${T("admin.staffMembers")}`}
        />
        <StatCard
          label={T("admin.totalRevenue")}
          value={formatCurrency(data.totalRevenue)}
          icon={DollarSign}
          color="bg-purple-600"
          subtitle={`${formatCurrency(data.monthlyRevenue)} ${T("admin.monthlyRevenue")}`}
        />
        <StatCard
          label={T("admin.totalSales")}
          value={formatNumber(data.totalSales)}
          icon={ShoppingCart}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={T("admin.products")}
          value={formatNumber(data.totalProducts)}
          icon={Package}
          color="bg-teal-600"
        />
        <StatCard
          label={T("admin.subscriptions")}
          value={formatNumber(data.totalSubscriptions)}
          icon={TrendingUp}
          color="bg-indigo-600"
        />
        <StatCard
          label={T("admin.aiConversations")}
          value={formatNumber(data.totalAiConversations)}
          icon={Sparkles}
          color="bg-pink-600"
        />
        <StatCard
          label={T("admin.pendingStores")}
          value={formatNumber(data.pendingStores)}
          icon={AlertTriangle}
          color={data.pendingStores > 0 ? "bg-red-600" : "bg-gray-400"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">{T("admin.planBreakdown")}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.starter")}</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.starter}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.professional")}</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.pro}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.business")}</span>
              <span className="text-sm font-medium text-gray-900">
                {data.planBreakdown.business}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">{T("admin.storeStatus")}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.active")}</span>
              <span className="text-sm font-medium text-green-600">
                {data.activeStores}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.pending")}</span>
              <span className="text-sm font-medium text-yellow-600">
                {data.pendingStores}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.suspended")}</span>
              <span className="text-sm font-medium text-red-600">
                {data.suspendedStores}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-500">{T("admin.quickStats")}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.productsListed")}</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(data.totalProducts)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.staffMembers")}</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(data.totalStaff)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{T("admin.monthlyRevenue")}</span>
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
