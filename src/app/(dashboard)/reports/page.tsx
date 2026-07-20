"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/common/Loader";

const ReportsPageContent = dynamic(
  () => import("@/features/reports/components/ReportsPageContent"),
  { loading: () => <Loader />, ssr: false }
);

export default function ReportsPage() {
  return <ReportsPageContent />;
}
