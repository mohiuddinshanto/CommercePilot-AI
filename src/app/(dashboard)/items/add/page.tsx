"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useCreateProduct } from "@/features/products/hooks/useProducts";
import type { CreateProductInput, UpdateProductInput } from "@/types/product";

export default function AddItemPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const submit = async (input: CreateProductInput | UpdateProductInput) => {
    try { await createProduct.mutateAsync(input as CreateProductInput); toast.success("Item added successfully."); router.push("/items/manage"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not add the item."); }
  };
  return <div className="mx-auto max-w-4xl space-y-6"><button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"><ArrowLeft className="h-4 w-4"/>Back</button><div className="flex items-center gap-3"><PackagePlus className="h-8 w-8 text-blue-600"/><div><h1 className="text-2xl font-bold text-gray-900">Add item</h1><p className="text-sm text-gray-500">Create a complete, customer-ready product listing.</p></div></div><section className="rounded-xl border border-gray-200 bg-white p-6"><ProductForm onSubmit={submit} onCancel={() => router.push("/items/manage")} isLoading={createProduct.isPending}/></section></div>;
}
