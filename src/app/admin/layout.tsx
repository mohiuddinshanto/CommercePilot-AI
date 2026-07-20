"use client";

import { useAuth } from "@/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Shield,
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Activity,
  Server,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/system", label: "System", icon: Server },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  if (user.role !== "super_admin") return null;

  if (pathname === "/admin") {
    router.replace("/admin/dashboard");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <nav className="sticky top-6 space-y-1">
            <div className="mb-4 flex items-center gap-2 px-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                Admin Panel
              </span>
            </div>
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </DashboardLayout>
  );
}
