"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/use-t";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const T = useT();
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [status, setStatus] = useState(category?.status || "active");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateCategoryInput | UpdateCategoryInput = {
      name,
      description: description || undefined,
      status,
      sortOrder: Number(sortOrder),
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {T("categories.form.categoryName")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("categories.form.categoryNamePlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{T("categories.form.description")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("categories.form.descriptionPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">{T("common.status")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{T("categories.form.sortOrder")}</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
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
          {isLoading ? T("common.saving", "Saving...") : category ? T("categories.edit") : T("categories.add")}
        </button>
      </div>
    </form>
  );
}
