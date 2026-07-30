"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/use-t";
import type { Bundle, CreateBundleInput, UpdateBundleInput, BundleProduct } from "@/types/bundle";
import { BundleProductSelector } from "./BundleProductSelector";
import { BUNDLE_STATUS } from "@/constants";

interface BundleFormProps {
  bundle?: Bundle;
  onSubmit: (data: CreateBundleInput | UpdateBundleInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BundleForm({ bundle, onSubmit, onCancel, isLoading }: BundleFormProps) {
  const T = useT();
  const [name, setName] = useState(bundle?.name || "");
  const [description, setDescription] = useState(bundle?.description || "");
  const [image, setImage] = useState(bundle?.image || "");
  const [products, setProducts] = useState<BundleProduct[]>(
    bundle?.products || []
  );
  const [bundlePrice, setBundlePrice] = useState(bundle?.bundlePrice?.toString() || "0");
  const [status, setStatus] = useState(bundle?.status || BUNDLE_STATUS.DRAFT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bundle) {
      const data: UpdateBundleInput = {
        name,
        description,
        image,
        products,
        bundlePrice: Number(bundlePrice),
        status,
      };
      onSubmit(data);
    } else {
      const data: CreateBundleInput = {
        name,
        description,
        image,
        products,
        bundlePrice: Number(bundlePrice),
        status,
      };
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("bundles.form.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("bundles.form.namePlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{T("bundles.form.description")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("bundles.form.descriptionPlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{T("bundles.form.imageUrl")}</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("bundles.form.imageUrlPlaceholder")}
        />
      </div>

      <BundleProductSelector products={products} onChange={setProducts} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("bundles.form.bundlePrice")}
          </label>
          <input
            type="number"
            value={bundlePrice}
            onChange={(e) => setBundlePrice(e.target.value)}
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{T("bundles.form.status")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={BUNDLE_STATUS.DRAFT}>{T("common.draft", "Draft")}</option>
            <option value={BUNDLE_STATUS.ACTIVE}>{T("common.active", "Active")}</option>
            <option value={BUNDLE_STATUS.ARCHIVED}>{T("common.archived", "Archived")}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {T("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? T("common.saving", "Saving...") : bundle ? T("common.update") : T("common.create")}
        </button>
      </div>
    </form>
  );
}
