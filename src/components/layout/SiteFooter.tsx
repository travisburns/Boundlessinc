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
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span className="italic">The world is not finished.</span>
        </div>
      </Container>
    </footer>
  );
}
