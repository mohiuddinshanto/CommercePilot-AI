"use client";

import { useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/common/Loader";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      const timer = setTimeout(() => router.push("/login"));
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
