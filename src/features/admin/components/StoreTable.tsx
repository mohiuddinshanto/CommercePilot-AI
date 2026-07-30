"use client";

import { useT } from "@/lib/i18n/use-t";
import { formatDate } from "@/lib/utils";
import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
import type { AdminStore } from "../types/admin";
import { PLAN_LABELS, STATUS_LABELS } from "../types/admin";

interface StoreTableProps {
  items: AdminStore[];
  onView: (store: AdminStore) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "suspended":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function StoreTable({
  items,
  onView,
  onApprove,
  onReject,
  onSuspend,
}: StoreTableProps) {
  const T = useT();
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">{T("admin.searchStores")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.storeName")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.owner")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.plan")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.status")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.products")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.staff")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.created")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              {T("admin.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((store) => (
            <tr key={store._id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{store.storeName}</p>
                  <p className="text-xs text-gray-500">{store.storeSlug}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div>
                  <p className="text-sm text-gray-900">{store.ownerName || T("admin.na")}</p>
                  <p className="text-xs text-gray-500">{store.ownerEmail || ""}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-gray-700">
                  {PLAN_LABELS[store.plan] || store.plan}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                    store.accountStatus
                  )}`}
                >
                  {STATUS_LABELS[store.accountStatus] || store.accountStatus}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                {store.productCount || 0}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                {store.staffCount || 0}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(store.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(store)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title={T("admin.viewDetails")}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {store.accountStatus === "pending" && (
                    <>
                      <button
                        onClick={() => onApprove(store._id)}
                        className="rounded p-1 text-green-400 hover:bg-green-50 hover:text-green-600"
                        title={T("admin.approve")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReject(store._id)}
                        className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                        title={T("admin.reject")}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {store.accountStatus === "approved" && (
                    <button
                      onClick={() => onSuspend(store._id)}
                      className="rounded p-1 text-yellow-400 hover:bg-yellow-50 hover:text-yellow-600"
                      title={T("admin.suspend")}
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
