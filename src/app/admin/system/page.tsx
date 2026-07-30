"use client";

import { useT } from "@/lib/i18n/use-t";
import { useAuth } from "@/providers/auth-provider";
import { SystemHealth } from "@/features/admin/components/SystemHealth";
import { useSystemStats } from "@/features/admin/hooks/useAdmin";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminSystemPage() {
  const T = useT();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, isLoading, error } = useSystemStats();

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title={T("error.title")} message={T("error.message")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{T("admin.systemHealth")}</h1>
          <p className="text-sm text-gray-500">{T("admin.systemHealthSubtitle")}</p>
        </div>
      </div>
      <SystemHealth data={data || null} />
    </div>
  );
}
