"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { RingDashboard } from "@/features/work/components/RingDashboard";

export default function RingDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <RingLoader slug={slug} active="assignments" render={(ring) => <RingDashboard ring={ring} />} />;
}
