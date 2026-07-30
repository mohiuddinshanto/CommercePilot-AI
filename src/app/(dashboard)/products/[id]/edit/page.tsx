"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/features/products/hooks/useProducts";
import { ProductForm } from "@/features/products/components/ProductForm";
import { ErrorPage } from "@/components/common/ErrorPage";
import { FullPageLoader } from "@/components/common/Loader";
import { useT } from "@/lib/i18n/use-t";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CreateProductInput, UpdateProductInput } from "@/types/product";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const T = useT();
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: CreateProductInput | UpdateProductInput) => {
    try {
      await updateProduct.mutateAsync({
        id,
        input: data as UpdateProductInput,
      });
      toast.success("Product updated successfully.");
      router.push(`/products/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product.");
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error || !product) {
    return <ErrorPage title={T("products.notFound")} message={T("products.editNotFoundMessage", "Could not load product details for editing.")} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/products/${id}`}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{T("products.edit")}</h1>
            <p className="text-sm text-gray-500">{T("products.editSubtitle", "Update product details and pricing.")}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/products/${id}`)}
          isLoading={updateProduct.isPending}
        />
      </div>
    </div>
  );
}
