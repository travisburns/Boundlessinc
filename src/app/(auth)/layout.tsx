import Link from "next/link";
import { Emblem } from "@/components/shared/Emblem";

/**
 * Authentication shell — the "temple gateway" backdrop from the design, with the
 * emblem, engraved wordmark, and purpose line above the card. Employee access
 * stays visually part of Boundless Enterprises.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      {/* backdrop — blurred so the source mockup's baked text reads only as
          atmospheric temple light, not legible copy. */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/corporate/login_bg.png')",
            filter: "blur(9px) brightness(0.7) saturate(1.1)",
          }}
        />
      </div>
      {/* Darken the center (hiding the mockup's baked content) while letting the
          archway columns and warm light read at the edges. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 90% at 50% 44%, color-mix(in srgb, var(--color-void) 88%, transparent) 30%, color-mix(in srgb, var(--color-void) 55%, transparent) 85%), linear-gradient(to bottom, var(--color-void), color-mix(in srgb, var(--color-void) 45%, transparent) 42%, var(--color-void))",
        }}
        aria-hidden
      />

      <div className="mb-8 flex flex-col items-center text-center">
        <Emblem size={64} />
        <span className="mt-5 font-display text-2xl tracking-[0.3em] text-[var(--color-text)]">
          BOUNDLESS
        </span>
        <span className="mt-1 font-display text-xs tracking-[0.5em] text-[var(--color-text-muted)]">
          ENTERPRISES
        </span>
        <span className="mt-4 u-micro text-[var(--color-gold)]">One account. A greater purpose.</span>
      </div>

      <div className="w-full max-w-md rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-surface)]/85 p-8 shadow-[var(--shadow-elev)] backdrop-blur-md">
        {children}
      </div>

      <Link
        href="/"
        className="mt-6 text-xs text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text-muted)]"
      >
        ← Back to Boundless Enterprises
      </Link>
    </div>
  );
}
