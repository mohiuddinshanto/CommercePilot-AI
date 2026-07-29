"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAcceptInvitation } from "@/features/staff/hooks/useStaff";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

type PageState = "checking" | "login_required" | "accepting" | "success" | "error";

export default function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const { session, refresh } = useAuth();
  const acceptInvitation = useAcceptInvitation();

  const [state, setState] = useState<PageState>("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setErrorMessage("Invalid or missing invitation link. Please ask your store owner to resend the invitation.");
      return;
    }

    // If user is not logged in, redirect to login with token stored in sessionStorage
    if (!session) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingInviteToken", token);
      }
      setState("login_required");
      return;
    }

    // User is logged in — accept automatically
    setState("accepting");
    acceptInvitation.mutate(token, {
      onSuccess: async (staff) => {
        setStaffRole(
          (staff.role ?? "staff").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        );
        setStoreName("your store");
        setState("success");
        await refresh();
        // Redirect to dashboard after short delay
        setTimeout(() => router.push("/dashboard"), 2800);
      },
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Something went wrong. The invitation may have expired or already been used.";
        setErrorMessage(msg);
        setState("error");
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, session]);

  // ── Checking state ──
  if (state === "checking" || state === "accepting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-white">
            {state === "accepting" ? "Accepting your invitation…" : "Checking invitation…"}
          </p>
          <p className="text-sm text-slate-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // ── Login required state ──
  if (state === "login_required") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl ring-1 ring-blue-400/30">
                📩
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-white">
              You've been invited!
            </h1>
            <p className="mb-8 text-center text-sm text-slate-400">
              Sign in or create an account to accept the staff invitation and join your team.
            </p>

            <div className="space-y-3">
              <Link
                href={`/login?redirect=/accept-invite%3Ftoken%3D${encodeURIComponent(token)}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95"
              >
                Sign In to Accept
              </Link>
              <Link
                href={`/register?redirect=/accept-invite%3Ftoken%3D${encodeURIComponent(token)}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 active:scale-95"
              >
                Create an Account
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Your invitation link will be saved automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ──
  if (state === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
            {/* Animated checkmark */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-4xl ring-2 ring-emerald-400/40 animate-bounce">
                ✅
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-white">
              Welcome to the team!
            </h1>
            <p className="mb-2 text-center text-sm text-slate-300">
              You've successfully joined{" "}
              <span className="font-semibold text-white">{storeName}</span>.
            </p>

            {staffRole && (
              <div className="mx-auto mb-6 w-fit rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-semibold text-blue-300 ring-1 ring-blue-400/30">
                Role: {staffRole}
              </div>
            )}

            <p className="mb-6 text-center text-sm text-slate-400">
              Redirecting you to the dashboard…
            </p>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full animate-[progress_2.8s_linear_forwards] rounded-full bg-blue-500" />
            </div>

            <Link
              href="/dashboard"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-3xl ring-1 ring-red-400/30">
              ❌
            </div>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            Invitation Not Found
          </h1>
          <p className="mb-8 text-center text-sm text-slate-400">
            {errorMessage || "This invitation link is invalid or has expired."}
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
