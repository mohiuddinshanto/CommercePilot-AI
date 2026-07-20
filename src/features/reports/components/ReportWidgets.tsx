"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import type {
  LowStockProduct,
  DeadStockProduct,
  MostReturnedProduct,
  SalesByPaymentMethod,
  DailySalesBreakdown,
} from "@/types/report";
import { AlertTriangle, Package, RotateCcw, CreditCard } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LowStockWidget({ data }: { data: LowStockProduct[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No low stock products.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {data.slice(0, 10).map((item) => (
            <div key={item.productId} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-yellow-600">
                  {item.currentStock} left
                </p>
                <p className="text-xs text-gray-400">Min: {item.lowStockLimit}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DeadStockWidget({ data }: { data: DeadStockProduct[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Dead Stock</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No dead stock products.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Days Since Sale
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice(0, 10).map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                    {item.currentStock}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-red-600">
                    {item.daysSinceLastSale !== null ? `${item.daysSinceLastSale} days` : "Never sold"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.inventoryValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MostReturnedWidget({ data }: { data: MostReturnedProduct[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <RotateCcw className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Most Returned Products</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No returned products.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Qty Returned
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Refund Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-900">
                    {formatNumber(item.totalReturned)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium text-red-600">
                    {formatCurrency(item.totalRefundAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PaymentMethodWidget({ data }: { data: SalesByPaymentMethod[] }) {
  const methodLabels: Record<string, string> = {
    cash: "Cash",
    card: "Card",
    mobile_banking: "Mobile Banking",
    bank_transfer: "Bank Transfer",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <CreditCard className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Sales by Payment Method</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No data available.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {data.map((item) => (
            <div key={item.method} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {methodLabels[item.method] || item.method}
                </p>
                <p className="text-xs text-gray-500">{item.count} transactions</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.totalRevenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DailySalesChart({ data }: { data: DailySalesBreakdown[] }) {
  return <div className="rounded-xl border border-gray-200 bg-white shadow-sm"><div className="border-b border-gray-200 px-6 py-4"><h3 className="text-lg font-semibold text-gray-900">Daily Sales</h3></div><div className="h-64 p-4">{data.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={(value) => String(value).slice(8, 10)} fontSize={12} /><YAxis tickFormatter={(value) => formatCurrency(Number(value))} fontSize={12} width={70} /><Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Date: ${label}`} /><Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#salesGradient)" strokeWidth={2} /></AreaChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-sm text-gray-500">No data available.</div>}</div></div>;
}
