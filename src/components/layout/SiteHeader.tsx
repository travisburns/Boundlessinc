import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/shared/Wordmark";
import { publicNav } from "@/lib/constants/navigation";

/** Public site header: wordmark, primary navigation, and the portal entry point. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)]/70 bg-[var(--color-ink)]/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-3">
          <Button href="/login" variant="outline" size="sm">
            Employee Login
          </Button>
        </div>
      </Container>
    </header>
  );
}
