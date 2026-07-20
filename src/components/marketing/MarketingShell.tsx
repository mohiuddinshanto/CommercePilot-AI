"use client";

import Link from "next/link";
import { Menu, Store, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signOutAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, refresh } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutAction();
      await refresh();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const links = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/ai", label: "AI Copilot" },
        { href: "/ai/generator", label: "AI Generator" },
        { href: "/items", label: "Explore" },
        { href: "/items/manage", label: "Manage Items" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/items", label: "Explore" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Insights" },
        { href: "/help", label: "Help" },
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Store className="h-5 w-5" />
            </span>
            CommercePilot
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
                <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-700">
                  Sign in
                </Link>
                <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Start free
                </Link>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Toggle navigation">
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <div className="grid gap-2">
              {links.map((link) => (
                <Link key={link.href} onClick={() => setOpen(false)} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button onClick={() => { setOpen(false); handleLogout(); }} className="rounded-lg border border-red-200 bg-red-50 py-2 text-center text-sm font-semibold text-red-600 hover:bg-red-100">
                  Sign out
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      {children}
      <footer className="mt-16 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <Store className="h-5 w-5 text-blue-400" /> CommercePilot
            </div>
            <p className="mt-3 text-sm leading-6">Practical inventory decisions, powered by your live commerce data.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Explore</p>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href="/items">Product catalog</Link>
              <Link href="/about">About us</Link>
              <Link href="/blog">Commerce insights</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Support</p>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href="/help">Help center</Link>
              <Link href="/contact">Contact us</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <p className="mt-3 text-sm">support@commercepilot.ai<br />+880 1322 901105</p>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CommercePilot AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

