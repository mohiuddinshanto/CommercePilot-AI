"use client";

import { useState } from "react";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [barcode, setBarcode] = useState(product?.barcode || "");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateProductInput | UpdateProductInput = {
      name,
      sku,
      barcode: barcode || undefined,
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Premium Panjabi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="PANJABI-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Short Description</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Brief summary for listings (max 250 characters)"
          maxLength={250}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Detailed description for product page"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="1500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selling Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="2200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Price</label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="1999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Low Stock Limit</label>
          <input
            type="number"
            value={lowStockLimit}
            onChange={(e) => setLowStockLimit(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="panjabi, premium, cotton"
          />
          <p className="mt-1 text-xs text-gray-400">Comma separated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://example.com/product.jpg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Available from</label>
          <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
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
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

