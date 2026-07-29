"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { post } from "@/core/api-client";
import { Store, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const { user, isAuthenticated, isLoading, refresh } = useAuth();
  const router = useRouter();

  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdStoreId, setCreatedStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && user?.storeId) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStoreName(val);
    setStoreSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeSlug.trim()) {
      toast.error("Please enter a valid store name.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await post<{ storeId: string }>("/api/v1/auth/store", {
        storeName: storeName.trim(),
        storeSlug: storeSlug.trim(),
        currency,
        timezone,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });

      setCreatedStoreId(res.storeId);
      await refresh();
      toast.success("Store created successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create store.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (createdStoreId || user?.storeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-white">Store Created Successfully!</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your store <strong className="text-white">"{storeName || "Workspace"}"</strong> is now registered.
          </p>
          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">Approval Required</p>
            <p className="mt-1 text-xs text-yellow-200/90">
              Super Admin approval is pending for new stores. Once approved by the administrator, your dashboard will be fully active!
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <Store className="h-6 w-6" />
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5" /> Workspace Onboarding
          </p>

          <h1 className="mt-3 text-2xl font-bold text-white">Create Your Store</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome, {user?.name || "Operator"}! Set up your store workspace to start.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Store Name *</label>
            <input
              type="text"
              value={storeName}
              onChange={handleNameChange}
              required
              placeholder="e.g. Acme Fashion Store"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Store Slug / Identifier *</label>
            <input
              type="text"
              value={storeSlug}
              onChange={(e) => setStoreSlug(e.target.value.toLowerCase())}
              required
              placeholder="acme-fashion-store"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Phone Number (Optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801700000000"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Store Address (Optional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dhaka, Bangladesh"
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Creating store workspace..." : "Create Store & Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}
