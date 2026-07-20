"use client";

import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Sale } from "@/types/sale";
import { Receipt, Printer } from "lucide-react";

interface InvoicePreviewProps {
  sale: Sale;
}

export function InvoicePreview({ sale }: InvoicePreviewProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Invoice</h2>
            <p className="text-sm text-gray-500">{sale.invoiceNumber}</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
          <p className="text-sm font-medium text-gray-900">{sale.customerName}</p>
          {sale.customerPhone && (
            <p className="text-sm text-gray-600">{sale.customerPhone}</p>
          )}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
          <p className="text-sm text-gray-900">{formatDateTime(sale.createdAt)}</p>
          <p className="text-sm text-gray-600 capitalize">
            {sale.paymentMethod.replace("_", " ")}
          </p>
        </div>
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-2 text-left font-medium text-gray-600">Item</th>
            <th className="pb-2 text-right font-medium text-gray-600">Qty</th>
            <th className="pb-2 text-right font-medium text-gray-600">Price</th>
            <th className="pb-2 text-right font-medium text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-2">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </td>
              <td className="py-2 text-right text-gray-600">{item.quantity}</td>
              <td className="py-2 text-right text-gray-600">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="py-2 text-right font-medium text-gray-900">
                {formatCurrency(item.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">-{formatCurrency(sale.discount)}</span>
          </div>
        )}
        {sale.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>+{formatCurrency(sale.tax)}</span>
          </div>
        )}
        {sale.shipping > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>+{formatCurrency(sale.shipping)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
          <span>Grand Total</span>
          <span>{formatCurrency(sale.grandTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paid</span>
          <span className="text-green-600 font-medium">{formatCurrency(sale.paidAmount)}</span>
        </div>
        {sale.dueAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Due</span>
            <span className="text-red-600 font-medium">{formatCurrency(sale.dueAmount)}</span>
          </div>
        )}
      </div>

      {sale.notes && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Notes</p>
          <p className="text-sm text-gray-700">{sale.notes}</p>
        </div>
      )}
    </div>
  );
}
