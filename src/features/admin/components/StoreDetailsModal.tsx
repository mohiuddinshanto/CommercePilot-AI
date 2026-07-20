"use client";

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

        <h3 className="text-lg font-semibold text-gray-900">Store Details</h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Store Name</p>
            <p className="text-sm font-medium text-gray-900">{store.storeName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Slug</p>
            <p className="text-sm font-medium text-gray-900">{store.storeSlug}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Owner</p>
            <p className="text-sm font-medium text-gray-900">
              {store.ownerName || "N/A"}
            </p>
            <p className="text-xs text-gray-500">{store.ownerEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-sm font-medium text-gray-900">
              {PLAN_LABELS[store.plan] || store.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-sm font-medium text-gray-900">
              {STATUS_LABELS[store.accountStatus] || store.accountStatus}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Currency</p>
            <p className="text-sm font-medium text-gray-900">{store.currency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-900">{store.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{store.email || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-sm font-medium text-gray-900">{store.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-sm font-medium text-gray-900">{store.productCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Staff</p>
            <p className="text-sm font-medium text-gray-900">{store.staffCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(store.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(store.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
