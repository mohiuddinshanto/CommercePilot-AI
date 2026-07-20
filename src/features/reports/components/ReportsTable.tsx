"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct, TopCategory, TopCustomer, BestCashier } from "@/types/report";

interface DataTableProps<T> {
  title: string;
  columns: { key: string; label: string; align?: "left" | "right" }[];
  data: T[];
  renderCell: (item: T, key: string) => React.ReactNode;
}

function DataTable<T>({ title, columns, data, renderCell }: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-500">No data available.</div>
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
  return (
    <DataTable
      title="Top Products"
      columns={[
        { key: "name", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "totalQuantitySold", label: "Qty Sold", align: "right" },
        { key: "totalRevenue", label: "Revenue", align: "right" },
        { key: "avgUnitPrice", label: "Avg Price", align: "right" },
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
  return (
    <DataTable
      title="Top Categories"
      columns={[
        { key: "categoryName", label: "Category" },
        { key: "productCount", label: "Products", align: "right" },
        { key: "totalQuantitySold", label: "Qty Sold", align: "right" },
        { key: "totalRevenue", label: "Revenue", align: "right" },
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
  return (
    <DataTable
      title="Top Customers"
      columns={[
        { key: "customerName", label: "Customer" },
        { key: "customerPhone", label: "Phone" },
        { key: "totalOrders", label: "Orders", align: "right" },
        { key: "totalSpent", label: "Total Spent", align: "right" },
        { key: "avgOrderValue", label: "Avg Order", align: "right" },
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
  return (
    <DataTable
      title="Best Cashiers"
      columns={[
        { key: "createdBy", label: "Cashier" },
        { key: "totalSales", label: "Sales", align: "right" },
        { key: "totalRevenue", label: "Revenue", align: "right" },
        { key: "avgSaleValue", label: "Avg Sale", align: "right" },
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
