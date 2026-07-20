"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  useSalesReport,
  useTopProducts,
  useTopCategories,
  useTopCustomers,
  useBestCashiers,
  useSalesByPaymentMethod,
  useSalesByDay,
  useInventoryValue,
  useLowStockProducts,
  useDeadStockProducts,
  useMostReturnedProducts,
  useProfitReport,
} from "@/features/reports/hooks/useReports";
import { ReportFilters } from "@/features/reports/components/ReportFilters";
import { SalesReportCards, InventoryReportCards, ProfitReportCards } from "@/features/reports/components/ReportCards";
import {
  TopProductsTable,
  TopCategoriesTable,
  TopCustomersTable,
  BestCashiersTable,
} from "@/features/reports/components/ReportsTable";
import {
  LowStockWidget,
  DeadStockWidget,
  MostReturnedWidget,
  PaymentMethodWidget,
  DailySalesChart,
} from "@/features/reports/components/ReportWidgets";
import { ErrorPage } from "@/components/common/ErrorPage";
import type { ReportQueryParams } from "@/types/report";

type ReportTab = "sales" | "inventory" | "profit" | "ranking";

export default function ReportsPageContent() {
  const [params, setParams] = useState<ReportQueryParams>({
    period: "thisMonth",
  });
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");

  const { data: salesReport, isLoading: salesLoading, error: salesError } = useSalesReport(params);
  const { data: topProducts } = useTopProducts(params);
  const { data: topCategories } = useTopCategories(params);
  const { data: topCustomers } = useTopCustomers(params);
  const { data: bestCashiers } = useBestCashiers(params);
  const { data: paymentMethods } = useSalesByPaymentMethod(params);
  const { data: dailySales } = useSalesByDay(params);
  const { data: inventoryValue } = useInventoryValue();
  const { data: lowStock } = useLowStockProducts();
  const { data: deadStock } = useDeadStockProducts();
  const { data: mostReturned } = useMostReturnedProducts(params);
  const { data: profitReport, isLoading: profitLoading } = useProfitReport(params);

  if (salesError) {
    return <ErrorPage title="Failed to load reports" message="Could not fetch report data." />;
  }

  const tabs: { value: ReportTab; label: string }[] = [
    { value: "sales", label: "Sales" },
    { value: "inventory", label: "Inventory" },
    { value: "profit", label: "Profit" },
    { value: "ranking", label: "Rankings" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">
            View detailed reports and insights for your store.
          </p>
        </div>
      </div>

      <ReportFilters params={params} onChange={setParams} />

      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "sales" && (
        <div className="space-y-6">
          {salesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-6">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : salesReport ? (
            <SalesReportCards
              totalSales={salesReport.totalSales}
              totalRevenue={salesReport.totalRevenue}
              avgSaleValue={salesReport.avgSaleValue}
              completedSales={salesReport.completedSales}
              totalPaid={salesReport.totalPaid}
              totalDue={salesReport.totalDue}
            />
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {dailySales && <DailySalesChart data={dailySales} />}
            {paymentMethods && <PaymentMethodWidget data={paymentMethods} />}
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-6">
          {inventoryValue ? (
            <InventoryReportCards
              totalProducts={inventoryValue.totalProducts}
              totalStockUnits={inventoryValue.totalStockUnits}
              totalInventoryValue={inventoryValue.totalInventoryValue}
              lowStockCount={inventoryValue.lowStockCount}
              outOfStockCount={inventoryValue.outOfStockCount}
            />
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {lowStock && <LowStockWidget data={lowStock} />}
            {deadStock && <DeadStockWidget data={deadStock} />}
          </div>

          {mostReturned && <MostReturnedWidget data={mostReturned} />}
        </div>
      )}

      {activeTab === "profit" && (
        <div className="space-y-6">
          {profitLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-6">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : profitReport ? (
            <ProfitReportCards
              totalRevenue={profitReport.totalRevenue}
              totalCost={profitReport.totalCost}
              totalProfit={profitReport.totalProfit}
              profitMargin={profitReport.profitMargin}
            />
          ) : null}
        </div>
      )}

      {activeTab === "ranking" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {topProducts && topProducts.length > 0 && <TopProductsTable data={topProducts} />}
            {topCategories && topCategories.length > 0 && <TopCategoriesTable data={topCategories} />}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {topCustomers && topCustomers.length > 0 && <TopCustomersTable data={topCustomers} />}
            {bestCashiers && bestCashiers.length > 0 && <BestCashiersTable data={bestCashiers} />}
          </div>
        </div>
      )}
    </div>
  );
}
