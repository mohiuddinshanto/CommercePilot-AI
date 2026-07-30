"use client";

import { useT } from "@/lib/i18n/use-t";
import { X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { AdminStore } from "../types/admin";
import { PLAN_LABELS, STATUS_LABELS } from "../types/admin";

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: AdminStore | null;
}

export function StoreDetailsModal({ isOpen, onClose, store }: StoreDetailsModalProps) {
  const T = useT();
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900">{T("admin.viewDetails")}</h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">{T("admin.storeName")}</p>
            <p className="text-sm font-medium text-gray-900">{store.storeName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("common.slug")}</p>
            <p className="text-sm font-medium text-gray-900">{store.storeSlug}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.owner")}</p>
            <p className="text-sm font-medium text-gray-900">
              {store.ownerName || T("admin.na")}
            </p>
            <p className="text-xs text-gray-500">{store.ownerEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.plan")}</p>
            <p className="text-sm font-medium text-gray-900">
              {PLAN_LABELS[store.plan] || store.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.status")}</p>
            <p className="text-sm font-medium text-gray-900">
              {STATUS_LABELS[store.accountStatus] || store.accountStatus}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("onboarding.currency")}</p>
            <p className="text-sm font-medium text-gray-900">{store.currency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("common.phone")}</p>
            <p className="text-sm font-medium text-gray-900">{store.phone || T("admin.na")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("common.email")}</p>
            <p className="text-sm font-medium text-gray-900">{store.email || T("admin.na")}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">{T("common.address")}</p>
            <p className="text-sm font-medium text-gray-900">{store.address || T("admin.na")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.products")}</p>
            <p className="text-sm font-medium text-gray-900">{store.productCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.staff")}</p>
            <p className="text-sm font-medium text-gray-900">{store.staffCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("admin.created")}</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(store.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{T("common.date")}</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(store.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
