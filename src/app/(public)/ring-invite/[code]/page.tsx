import type { Metadata } from "next";
import { RingHolderAcceptForm } from "@/features/work/components/RingHolderAcceptForm";

export const metadata: Metadata = {
  title: "Claim Your Ring",
  description: "Accept your invitation to hold a ring at Boundless Enterprises.",
};

export default async function RingInvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <RingHolderAcceptForm code={code} />;
}
