"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Star } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { usePublicProducts, usePublicCategories } from "@/features/products/hooks/usePublicProducts";
import { formatCurrency, formatDate } from "@/lib/utils";

const fallbackImages = ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"];

export default function ExploreItemsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const { data: categoriesData } = usePublicCategories();
  const { data, isLoading, error } = usePublicProducts({
    page,
    limit: 12,
    search,
    categoryId: categoryId || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    order: sortBy === "sellingPrice" ? "asc" : "desc"
  });

  const categoriesList = Array.isArray(categoriesData) ? categoriesData : (categoriesData as { items: { _id: string; name: string }[] })?.items || [];
  const products = data?.items || [];

  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Explore</p>
          <h1 className="mt-2 text-4xl font-bold">A public catalog built for discovery.</h1>
          <p className="mt-3 text-slate-600">Search live, available products. Refine by category and price and order results by what matters to you.</p>
        </div>
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_130px_130px_180px]">
            <label className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </label>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat: { _id: string; name: string }) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              placeholder="Min price"
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              placeholder="Max price"
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <label className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full appearance-none rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="createdAt">Newest first</option>
                <option value="sellingPrice">Price: low to high</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </section>
      {error && <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">The public catalog is temporarily unavailable. Please try again shortly.</div>}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex min-h-[390px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="h-44 w-full animate-pulse bg-slate-200" />
                <div className="flex flex-1 flex-col p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 space-y-1.5">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                </div>
              </div>
            ))
          : products.map((product, index) => (
              <article
                key={product._id}
                className="flex min-h-[390px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Image
                  src={product.images[0] || fallbackImages[index % fallbackImages.length]}
                  alt={product.name}
                  width={400}
                  height={176}
                  className="h-44 w-full object-cover"
                  unoptimized
                />
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-1 font-bold">{product.name}</h2>
                  <p className="mt-2 min-h-10 line-clamp-2 text-sm text-slate-600">
                    {product.shortDescription || "View complete product information and availability."}
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <p className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Customer rating 4.8
                    </p>
                    <p>Listed {formatDate(product.createdAt)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="font-bold">
                      {formatCurrency(product.discountPrice || product.sellingPrice)}
                    </span>
                    <Link
                      href={`/items/${product._id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
        {!isLoading && !error && products.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 py-14 text-center text-slate-600">
            No products match those filters.
          </div>
        )}
      </div>
      {data && data.totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-300 p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="text-sm text-slate-600">Page {page} of {data.totalPages}</span><button disabled={page === data.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-300 p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div>}
    </main>
    </MarketingShell>
  );
}


