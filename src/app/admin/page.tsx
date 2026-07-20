"use client";

import { useAuth } from "@/providers/auth-provider";
import { Loader } from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "super_admin") {
        router.push("/dashboard");
      } else {
        router.replace("/admin/dashboard");
      }
    }
  }, [isLoading, user, router]);

  return <Loader />;
}
