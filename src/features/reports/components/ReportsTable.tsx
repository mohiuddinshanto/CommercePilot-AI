"use client";

import { useT } from "@/lib/i18n/use-t";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct, TopCategory, TopCustomer, BestCashier } from "@/types/report";

interface DataTableProps<T> {
  title: string;
  columns: { key: string; label: string; align?: "left" | "right" }[];
  data: T[];
  renderCell: (item: T, key: string) => React.ReactNode;
}

function DataTable<T>({ title, columns, data, renderCell }: DataTableProps<T>) {
  const T = useT();
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">{T("common.noData", "No data available.")}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${
                        col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {renderCell(item, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function TopProductsTable({ data }: { data: TopProduct[] }) {
  const T = useT();
  return (
    <DataTable
      title={T("reports.topProducts", "Top Products")}
      columns={[
        { key: "name", label: T("products.product") },
        { key: "sku", label: "SKU" },
        { key: "totalQuantitySold", label: T("reports.qtySold", "Qty Sold"), align: "right" },
        { key: "totalRevenue", label: T("common.revenue"), align: "right" },
        { key: "avgUnitPrice", label: T("reports.avgPrice", "Avg Price"), align: "right" },
      ]}
      data={data}
      renderCell={(item, key) => {
        switch (key) {
          case "totalQuantitySold":
            return formatNumber(item.totalQuantitySold);
          case "totalRevenue":
            return formatCurrency(item.totalRevenue);
          case "avgUnitPrice":
            return formatCurrency(item.avgUnitPrice);
          default:
            return item[key as keyof TopProduct];
        }
      }}
    />
  );
}

export function TopCategoriesTable({ data }: { data: TopCategory[] }) {
  const T = useT();
  return (
    <DataTable
      title={T("reports.topCategories", "Top Categories")}
      columns={[
        { key: "categoryName", label: T("categories.category") },
        { key: "productCount", label: T("categories.products"), align: "right" },
        { key: "totalQuantitySold", label: T("reports.qtySold", "Qty Sold"), align: "right" },
        { key: "totalRevenue", label: T("common.revenue"), align: "right" },
      ]}
      data={data}
      renderCell={(item, key) => {
        switch (key) {
          case "productCount":
            return formatNumber(item.productCount);
          case "totalQuantitySold":
            return formatNumber(item.totalQuantitySold);
          case "totalRevenue":
            return formatCurrency(item.totalRevenue);
          default:
            return item[key as keyof TopCategory];
        }
      }}
    />
  );
}

export function TopCustomersTable({ data }: { data: TopCustomer[] }) {
  const T = useT();
  return (
    <DataTable
      title={T("reports.topCustomers", "Top Customers")}
      columns={[
        { key: "customerName", label: T("sales.customer") },
        { key: "customerPhone", label: T("common.phone") },
        { key: "totalOrders", label: T("reports.orders", "Orders"), align: "right" },
        { key: "totalSpent", label: T("reports.totalSpent", "Total Spent"), align: "right" },
        { key: "avgOrderValue", label: T("reports.avgOrder", "Avg Order"), align: "right" },
      ]}
      data={data}
      renderCell={(item, key) => {
        switch (key) {
          case "totalOrders":
            return formatNumber(item.totalOrders);
          case "totalSpent":
            return formatCurrency(item.totalSpent);
          case "avgOrderValue":
            return formatCurrency(item.avgOrderValue);
          default:
            return item[key as keyof TopCustomer] || "-";
        }
      }}
    />
  );
}

export function BestCashiersTable({ data }: { data: BestCashier[] }) {
  const T = useT();
  return (
    <DataTable
      title={T("reports.bestCashiers", "Best Cashiers")}
      columns={[
        { key: "cashierName", label: T("staff.cashier") },
        { key: "totalSales", label: T("common.sales"), align: "right" },
        { key: "totalRevenue", label: T("common.revenue"), align: "right" },
        { key: "avgSaleValue", label: T("reports.avgSale", "Avg Sale"), align: "right" },
      ]}
      data={data}
      renderCell={(item, key) => {
        switch (key) {
          case "totalSales":
            return formatNumber(item.totalSales);
          case "totalRevenue":
            return formatCurrency(item.totalRevenue);
          case "avgSaleValue":
            return formatCurrency(item.avgSaleValue);
          default:
            return item[key as keyof BestCashier];
        }
      }}
    />
  );
}
