"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/common/Loader";

const AnalyticsPageContent = dynamic(
  () => import("@/features/analytics/components/AnalyticsPageContent"),
  { loading: () => <Loader />, ssr: false }
);

export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}
