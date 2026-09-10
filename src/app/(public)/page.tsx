import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Emblem } from "@/components/shared/Emblem";
import { MicroColumn } from "@/components/shared/MicroColumn";
import { OrbitDiagram } from "@/components/shared/OrbitDiagram";
import {
  IconHourglass,
  IconCompass,
  IconPeople,
  IconLeaf,
} from "@/components/shared/Icons";
import { siteConfig } from "@/lib/constants/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyWeExist />
      <OurPrinciple />
      <BuiltToEndure />
      <HouseOfCompanies />
      <TheLongHorizon />
      <ClosingBand />
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-cosmos relative overflow-hidden border-b border-[var(--color-line)]">
      {/* faint concentric orbital geometry */}
      <svg
        className="pointer-events-none absolute left-1/2 top-[-120px] -z-0 h-[680px] w-[1100px] -translate-x-1/2 opacity-[0.28]"
        viewBox="0 0 1100 680"
        fill="none"
        aria-hidden
      >
        <g stroke="var(--color-gold)" strokeWidth="1">
          <circle cx="550" cy="360" r="330" opacity="0.5" />
          <circle cx="550" cy="360" r="250" opacity="0.35" />
          <circle cx="550" cy="360" r="170" opacity="0.25" />
        </g>
        <path d="M550 20 L556 44 L580 44 L560 58 L568 82 L550 66 L532 82 L540 58 L520 44 L544 44 Z" fill="var(--color-gold-soft)" opacity="0.8" />
      </svg>

      <Container className="relative flex flex-col items-center py-28 text-center sm:py-36">
        <MicroColumn
          className="absolute left-5 top-28 sm:left-8"
          lines={["PEOPLE", "IDEAS", "COMPANIES", "A BRIGHTER", "TOMORROW"]}
        />
        <MicroColumn
          className="absolute right-5 top-28 sm:right-8"
          align="right"
          lines={["FURTHER", "HUMAN", "TOGETHER"]}
        />

        <p className="u-micro text-[var(--color-gold)]">A more human tomorrow</p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-[0.04em] text-[var(--color-text)] sm:text-7xl">
          BOUNDLESS
          <br />
          ENTERPRISES
        </h1>
        <p className="mt-4 font-serif text-2xl italic text-[var(--color-gold-soft)] sm:text-3xl">
          Building what comes after.
        </p>
        <p className="mt-5 max-w-xl text-balance text-[var(--color-text-muted)]">
          We build enduring companies for a more connected, capable, and human future.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href="/philosophy" variant="outline" size="lg">
            Our Philosophy
          </Button>
          <Button href="/companies" size="lg">
            Our Companies
          </Button>
        </div>
      </Container>
    </section>
  );
}

/* ── Why we exist ─────────────────────────────────────────────────────── */
function WhyWeExist() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
      <Container className="grid items-stretch gap-8 py-16 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            Why Boundless Exists
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-[var(--color-text-muted)]">
            Technology should expand the human experience, not diminish it. Boundless
            Enterprises builds companies, products, experiences, and institutions that
            serve human beings first. We are building for decades, not quarters.
          </p>
        </div>
        <ImagePanel src="/images/corporate/mountains.png" alt="Mountain range at dusk">
          <p className="font-serif text-lg italic text-[var(--color-gold-soft)]">
            A more
            <br />
            human future
            <br />
            is a brighter one.
          </p>
        </ImagePanel>
      </Container>
    </section>
  );
}

/* ── Our Principle ────────────────────────────────────────────────────── */
function OurPrinciple() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-void)]">
      <Container className="grid items-center gap-6 py-16 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            Our Principle
          </h2>
          <span className="rule-gold mt-4 block" />
          <p className="mt-5 max-w-xs text-[var(--color-text-muted)]">
            People are the center. Everything else is a tool.
          </p>
        </div>
        <OrbitDiagram className="mx-auto w-full max-w-lg" />
        <p className="font-serif text-lg italic text-[var(--color-text-muted)] lg:text-right">
          Tools for
          <br />a more human
          <br />
          world.
        </p>
      </Container>
    </section>
  );
}

/* ── Built to Endure ──────────────────────────────────────────────────── */
function BuiltToEndure() {
  const pillars = [
    { Icon: IconHourglass, title: "Long Horizons", body: "Decades over quarters." },
    { Icon: IconCompass, title: "Independent Companies", body: "Distinct missions and cultures." },
    { Icon: IconPeople, title: "Human-First Design", body: "People before systems." },
    { Icon: IconLeaf, title: "Real Value", body: "Build things worth keeping." },
  ];
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
      <Container className="py-16">
        <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">Built to Endure</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon size={30} className="text-[var(--color-gold)]" />
              <h3 className="mt-4 font-serif text-lg text-[var(--color-text)]">{title}</h3>
              <p className="mt-1 text-sm italic text-[var(--color-text-muted)]">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── A House of Companies ─────────────────────────────────────────────── */
function HouseOfCompanies() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-void)]">
      <Container className="grid items-center gap-8 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            A House of Companies
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-[var(--color-text-muted)]">
            Boundless Enterprises operates across technology, media, hospitality, consumer
            products, and emerging industries. Each company maintains its own identity while
            sharing a common belief: build something worth existing.
          </p>
          <div className="mt-7">
            <Button href="/companies" variant="outline">
              Explore Our Companies
            </Button>
          </div>
        </div>
        <ImagePanel src="/images/corporate/lake.png" alt="Mountain lake at sunrise">
          <MicroColumn align="right" lines={["DIFFERENT", "COMPANIES,", "A BRIGHTER", "TOMORROW."]} />
        </ImagePanel>
      </Container>
    </section>
  );
}

/* ── The Long Horizon ─────────────────────────────────────────────────── */
function TheLongHorizon() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)]">
      <Container className="grid items-center gap-8 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl text-[var(--color-text)] sm:text-4xl">
            The Long Horizon
          </h2>
          <p className="mt-5 text-lg text-[var(--color-text)]">
            We are not building for the next cycle. We are building beyond it.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-[var(--color-text-muted)]">
            We aim to leave behind better systems, companies that create, technology that
            empowers, stories that connect, and institutions worthy of inheritance.
          </p>
        </div>
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)] bg-[var(--color-void)]">
          <svg viewBox="0 0 460 240" className="w-full" fill="none" aria-hidden>
            <g stroke="var(--color-gold)" strokeWidth="1" opacity="0.6">
              <ellipse cx="230" cy="120" rx="180" ry="60" />
              <ellipse cx="230" cy="120" rx="120" ry="95" transform="rotate(24 230 120)" />
              <ellipse cx="230" cy="120" rx="150" ry="40" transform="rotate(-18 230 120)" />
            </g>
            <path d="M230 92 L236 116 L260 116 L240 130 L248 154 L230 138 L212 154 L220 130 L200 116 L224 116 Z" fill="var(--color-gold-soft)" />
            {[80, 360, 170, 300].map((x, i) => (
              <circle key={i} cx={x} cy={[110, 140, 70, 175][i]} r="2.5" fill="var(--color-gold)" opacity="0.8" />
            ))}
          </svg>
        </div>
      </Container>
    </section>
  );
}

/* ── Closing band ─────────────────────────────────────────────────────── */
function ClosingBand() {
  return (
    <section className="bg-cosmos relative overflow-hidden">
      <Container className="relative flex flex-col items-center py-24 text-center">
        <MicroColumn
          className="absolute left-5 top-1/2 -translate-y-1/2 sm:left-8"
          lines={["MORE PEOPLE", "BRIGHTER IDEAS", "KINDER SYSTEMS", "A LARGER TOMORROW"]}
        />
        <MicroColumn
          className="absolute right-5 top-1/2 -translate-y-1/2 sm:right-8"
          align="right"
          lines={["STILL", "SO MUCH", "FURTHER"]}
        />
        <Emblem size={44} className="opacity-90" />
        <h2 className="mt-6 font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
          The world is not finished.
        </h2>
        <p className="mt-2 font-serif text-xl text-[var(--color-text-muted)]">
          Neither is what humanity can build.
        </p>
        <div className="mt-8">
          <Button href="/companies" size="lg">
            Explore
          </Button>
        </div>
        <p className="mt-10 u-micro text-[var(--color-text-faint)]">{siteConfig.motto}</p>
      </Container>
    </section>
  );
}

/* ── Shared image panel with an overlaid caption ──────────────────────── */
function ImagePanel({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-52 overflow-hidden rounded-[var(--radius)] border border-[var(--color-line)]">
      <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-void)]/70 via-transparent to-[var(--color-void)]/40" />
      <div className="absolute inset-0 flex items-center justify-between p-6">
        <div>{children}</div>
      </div>
    </div>
  );
}
