import React, { Suspense } from "react";
import { ReportDetailView } from "@/components/reports/ReportDetailView";

export function generateStaticParams() {
  return [
    { id: "rep-weekly-20261023" },
    { id: "rep-pricing-q3" },
    { id: "rep-ai-copilot" },
    { id: "rep-developer-edge" },
    { id: "rep-compliance-trust" },
  ];
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-zinc-500">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading executive intelligence brief...
        </div>
      }
    >
      <ReportDetailView id={resolved.id} />
    </Suspense>
  );
}
