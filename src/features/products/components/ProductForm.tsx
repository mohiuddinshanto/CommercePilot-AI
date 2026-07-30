"use client";

import { useState, useEffect } from "react";
import { useT } from "@/lib/i18n/use-t";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/** Generate a SKU from product name: "Premium Panjabi" → "PREMIUM-PANJABI-A3X" */
function generateSku(name: string): string {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .slice(0, 3)
    .join("-");
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${base}-${suffix}`;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const T = useT();
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [skuTouched, setSkuTouched] = useState(!!product?.sku);
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() || "");
  const [sellingPrice, setSellingPrice] = useState(product?.sellingPrice?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [lowStockLimit, setLowStockLimit] = useState(product?.lowStockLimit?.toString() || "10");
  const [status, setStatus] = useState(product?.status || "active");
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || "");
  const [availableFrom, setAvailableFrom] = useState(product?.availableFrom?.slice(0, 10) || "");
  const [priority, setPriority] = useState(product?.priority || "medium");

  // Live SKU preview: auto-generate when name changes and user hasn't manually set SKU
  useEffect(() => {
    if (!skuTouched && name) {
      setSku(generateSku(name));
    }
  }, [name, skuTouched]);

  // Fetch all active categories for dropdown
  const { data: categoriesData } = useCategories({ limit: 100, status: "active" });
  const categories = categoriesData?.items || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSku = sku || generateSku(name);

    const data: CreateProductInput | UpdateProductInput = {
      name,
      sku: finalSku,
      categoryId: categoryId || undefined,
      shortDescription: shortDescription || undefined,
      description: description || undefined,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      lowStockLimit: Number(lowStockLimit),
      status,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images: imageUrl ? [imageUrl] : [],
      availableFrom: availableFrom || undefined,
      priority,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Name + Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("products.form.productName")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("products.form.productNamePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{T("common.status")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="active">{T("common.active", "Active")}</option>
            <option value="draft">{T("common.draft", "Draft")}</option>
            <option value="archived">{T("common.archived", "Archived")}</option>
          </select>
        </div>
      </div>

      {/* Row 2: SKU (auto) + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("products.sku")}{" "}
            {!skuTouched && name && (
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-normal text-green-700">
                {T("products.form.autoGenerated")}
              </span>
            )}
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => {
              setSku(e.target.value);
              setSkuTouched(true);
            }}
            onBlur={() => {
              if (!sku && name) {
                setSku(generateSku(name));
                setSkuTouched(false);
              }
            }}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("products.form.skuPlaceholder")}
          />
          <p className="mt-1 text-xs text-gray-400">
            {T("products.form.skuHelp")}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{T("products.category")}</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">{T("products.form.selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              {T("products.form.noCategories")} — {T("categories.add")}
            </p>
          )}
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">{T("products.form.shortDescription")}</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("products.form.shortDescriptionPlaceholder")}
          maxLength={250}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{T("products.form.fullDescription")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("products.form.fullDescriptionPlaceholder")}
        />
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("products.form.costPrice")}
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="1500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {T("products.form.sellingPrice")}
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="2200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{T("products.form.discountPrice")}</label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              min="0"
              step="0.01"
              className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="1999"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">{T("products.form.tags")}</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={T("products.form.tagsPlaceholder")}
        />
        <p className="mt-1 text-xs text-gray-400">{T("products.form.tagsHelp")}</p>
      </div>

      {/* Image + Date + Priority */}
      <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">{T("products.form.imageUrl")}</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("products.form.imageUrlPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{T("products.form.availableFrom")}</label>
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{T("products.form.priority")}</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="low">{T("products.form.low")}</option>
            <option value="medium">{T("products.form.medium")}</option>
            <option value="high">{T("products.form.high")}</option>
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
          {isLoading ? T("common.saving", "Saving...") : product ? T("products.edit") : T("products.add")}
        </button>
      </div>
    </form>
  );
}
