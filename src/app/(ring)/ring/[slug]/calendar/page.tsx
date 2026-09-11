"use client";

import { use } from "react";
import { RingLoader } from "@/features/work/components/RingLoader";
import { RingCalendarView } from "@/features/work/components/RingCalendarView";

export default function RingCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <RingLoader slug={slug} active="calendar" render={(ring) => <RingCalendarView ring={ring} />} />;
}
