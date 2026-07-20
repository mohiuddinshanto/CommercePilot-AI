"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Package, Star } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center"><Package className="mx-auto h-10 w-10 text-gray-300"/><p className="mt-3 text-sm text-gray-500">No products match these filters.</p></div>;
  }

  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {products.map((product) => {
      const image = product.images?.[0];
      return <article key={product._id} className="flex min-h-[390px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {image ? <Image src={image} alt={product.name} width={400} height={160} className="h-40 w-full object-cover" unoptimized /> : <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100"><Package className="h-10 w-10 text-blue-600"/></div>}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3"><div><h2 className="line-clamp-1 font-semibold text-gray-900">{product.name}</h2><p className="mt-1 text-xs text-gray-500">{product.sku}</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{product.status}</span></div>
          <p className="mt-3 line-clamp-2 min-h-10 text-sm text-gray-600">{product.shortDescription || "Product information and availability managed in CommercePilot."}</p>
          <div className="mt-4 space-y-2 text-xs text-gray-500"><div className="flex items-center gap-2"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>4.8 customer rating</div><div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5"/>{formatDate(product.availableFrom || product.createdAt)}</div><div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/>Available from your store</div></div>
          <div className="mt-auto flex items-center justify-between pt-4"><span className="font-bold text-gray-900">{formatCurrency(product.discountPrice || product.sellingPrice)}</span><Link href={`/items/${product._id}`} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">View Details</Link></div>
        </div>
      </article>;
    })}
  </div>;
}
