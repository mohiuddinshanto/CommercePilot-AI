"use client";

import { useState, useEffect } from "react";
import { useT } from "@/lib/i18n/use-t";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { signUpAction, signInWithGoogleAction } from "@/actions/auth.actions";
import { useAuth } from "@/providers/auth-provider";
import type { Session } from "@/types/user";

export default function RegisterForm() {
  const T = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setSession } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUpAction(name, email, password, selectedPlan);
      const session: Session = {
        user: result.user,
        session: {
          id: result.user.id,
          token: result.token,
          userId: result.user.id,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          createdAt: new Date().toISOString(),
        },
      };
      flushSync(() => setSession(session));

      // If there's a pending staff invitation, redirect to accept it instead of onboarding
      const pendingToken = typeof window !== "undefined"
        ? sessionStorage.getItem("pendingInviteToken")
        : null;
      if (pendingToken) {
        sessionStorage.removeItem("pendingInviteToken");
        router.push(`/accept-invite?token=${encodeURIComponent(pendingToken)}`);
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : T("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex flex-col items-center">
        <Store className="mb-3 h-10 w-10 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">{T("auth.createAccount")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {T("auth.registerSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            {T("auth.name")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("auth.namePlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {T("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("auth.emailPlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {T("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={T("auth.passwordPlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {T("auth.selectPlan")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedPlan("starter")}
              className={`rounded-xl border p-3 text-left transition ${
                selectedPlan === "starter"
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-xs font-semibold text-gray-900">{T("subs.free")}</div>
              <div className="mt-1 text-sm font-bold text-blue-600">৳0<span className="text-[10px] text-gray-500 font-normal">{T("subs.perMonth")}</span></div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("pro")}
              className={`rounded-xl border p-3 text-left transition ${
                selectedPlan === "pro"
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-xs font-semibold text-gray-900">{T("subs.upgrade")}</div>
              <div className="mt-1 text-sm font-bold text-blue-600">৳800<span className="text-[10px] text-gray-500 font-normal">{T("subs.perMonth")}</span></div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("business")}
              className={`rounded-xl border p-3 text-left transition ${
                selectedPlan === "business"
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-xs font-semibold text-gray-900">{T("admin.business")}</div>
              <div className="mt-1 text-sm font-bold text-blue-600">৳1500<span className="text-[10px] text-gray-500 font-normal">{T("subs.perMonth")}</span></div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? T("auth.creatingAccount") : T("auth.createAccount")}
        </button>
      </form>

      {mounted && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400">{T("auth.or")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogleAction}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {T("auth.continueWithGoogle")}
          </button>
        </>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        {T("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          {T("auth.signInLink")}
        </Link>
      </p>
    </div>
  );
}
