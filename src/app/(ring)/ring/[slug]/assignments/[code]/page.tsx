"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { AssignmentDetailView } from "@/features/work/components/AssignmentDetailView";

export default function AssignmentPage({ params }: { params: Promise<{ slug: string; code: string }> }) {
  const { slug, code } = use(params);
  return (
    <RingLoader
      slug={slug}
      active="assignments"
      render={(ring) => <AssignmentDetailView ring={ring} code={code} />}
    />
  );
}
