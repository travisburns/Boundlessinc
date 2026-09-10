import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/shared/Wordmark";
import { publicNav } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/constants/site";

/** Public site footer with navigation and the closing motto. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-void)]">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {siteConfig.motto}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {publicNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-4 text-[var(--color-text-faint)]">
              {["LinkedIn", "X", "Instagram", "YouTube"].map((s) => (
                <a key={s} href="#" aria-label={s} className="transition-colors hover:text-[var(--color-gold)]">
                  <SocialGlyph name={s} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span className="font-serif italic">The world is not finished.</span>
        </div>
      </Container>
    </footer>
  );
}

function SocialGlyph({ name }: { name: string }) {
  const common = { width: 18, height: 18, fill: "currentColor" } as const;
  switch (name) {
    case "LinkedIn":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.73 2.63 4.73 6V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" /></svg>
      );
    case "X":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M18.9 3H22l-7.3 8.34L23 21h-6.6l-5.17-6.76L5.3 21H2.2l7.8-8.92L1.6 3h6.75l4.67 6.18zM17.8 19.1h1.7L7.3 4.8H5.5z" /></svg>
      );
    case "Instagram":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 2 12a31 31 0 0 0 .1 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.8.5 7.8.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.1-3.8zM10 15V9l5.2 3z" /></svg>
      );
  }
}
