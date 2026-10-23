import React, { Suspense } from "react";
import { CompetitorDetailView } from "@/components/competitors/CompetitorDetailView";

export function generateStaticParams() {
  return [
    { id: "comp-acme" },
    { id: "comp-nova" },
    { id: "comp-orbit" },
    { id: "comp-vertex" },
    { id: "comp-pulse" },
    { id: "comp-nexa" },
  ];
}

export default async function CompetitorDetailPage({
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
          Loading competitor profile...
        </div>
      }
    >
      <CompetitorDetailView id={resolved.id} />
    </Suspense>
  );
}
