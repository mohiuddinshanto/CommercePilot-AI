"use client";

import { useState } from "react";
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
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., Summer Sale Bundle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Optional image URL"
        />
      </div>

      <BundleProductSelector products={products} onChange={setProducts} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bundle Price <span className="text-red-500">*</span>
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
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={BUNDLE_STATUS.DRAFT}>Draft</option>
            <option value={BUNDLE_STATUS.ACTIVE}>Active</option>
            <option value={BUNDLE_STATUS.ARCHIVED}>Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : bundle ? "Update Bundle" : "Create Bundle"}
        </button>
      </div>
    </form>
  );
}
