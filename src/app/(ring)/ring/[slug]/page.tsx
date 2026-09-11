"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { RingDashboard } from "@/features/work/components/RingDashboard";
import { CrownDashboard } from "@/features/work/components/CrownDashboard";

export default function RingDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="assignments"
      render={(ring) => (ring.domain === "Crown" ? <CrownDashboard ring={ring} /> : <RingDashboard ring={ring} />)}
    />
  );
}
