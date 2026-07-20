"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import {
  useSalesReport,
  useProfitReport,
  useTopProducts,
  useTopCategories,
  useSalesByDay,
  useSalesByMonth,
  useInventoryValue,
} from "@/features/reports/hooks/useReports";
import { ReportFilters } from "@/features/reports/components/ReportFilters";
import { SalesReportCards, ProfitReportCards, InventoryReportCards } from "@/features/reports/components/ReportCards";
import {
  TopProductsTable,
  TopCategoriesTable,
} from "@/features/reports/components/ReportsTable";
import { DailySalesChart } from "@/features/reports/components/ReportWidgets";
import { ErrorPage } from "@/components/common/ErrorPage";
import type { ReportQueryParams } from "@/types/report";

export default function AnalyticsPageContent() {
  const [params, setParams] = useState<ReportQueryParams>({
    period: "thisMonth",
  });

  const { data: salesReport, isLoading: salesLoading, error: salesError } = useSalesReport(params);
  const { data: profitReport, isLoading: profitLoading } = useProfitReport(params);
  const { data: topProducts } = useTopProducts(params);
  const { data: topCategories } = useTopCategories(params);
  const { data: dailySales } = useSalesByDay(params);
  const { data: monthlySales } = useSalesByMonth({ period: "thisYear" });
  const { data: inventoryValue } = useInventoryValue();

  if (salesError) {
    return <ErrorPage title="Failed to load analytics" message="Could not fetch analytics data." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">
            Visual analytics and trends for your store performance.
          </p>
        </div>
      </div>

      <ReportFilters params={params} onChange={setParams} />

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
          {monthlySales && monthlySales.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-1" style={{ height: "200px" }}>
                  {monthlySales.map((month, index) => {
                    const maxRev = Math.max(...monthlySales.map((m) => m.revenue), 1);
                    return (
                      <div key={index} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-purple-500"
                          style={{
                            height: `${(month.revenue / maxRev) * 160}px`,
                            minHeight: "2px",
                          }}
                          title={`${month.date}: $${month.revenue.toFixed(2)}`}
                        />
                        <span className="text-[10px] text-gray-500">
                          {month.date.substring(5, 7)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

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

        {inventoryValue && (
          <InventoryReportCards
            totalProducts={inventoryValue.totalProducts}
            totalStockUnits={inventoryValue.totalStockUnits}
            totalInventoryValue={inventoryValue.totalInventoryValue}
            lowStockCount={inventoryValue.lowStockCount}
            outOfStockCount={inventoryValue.outOfStockCount}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topProducts && topProducts.length > 0 && <TopProductsTable data={topProducts} />}
          {topCategories && topCategories.length > 0 && <TopCategoriesTable data={topCategories} />}
        </div>
      </div>
    </div>
  );
}
