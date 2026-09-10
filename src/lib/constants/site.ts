/** Static configuration for the Boundless Enterprises public site. */
export const siteConfig = {
  name: "Boundless Enterprises",
  tagline: "Building what comes after.",
  description:
    "A unified corporate platform for the Boundless Enterprises holding company: " +
    "public company discovery, subsidiary access, employee identity, onboarding, " +
    "payments, shared services, and a private intelligence layer.",
  mission:
    "To help usher in a new age of human-centered enterprise — building " +
    "technology, media, experiences, and institutions that connect people, " +
    "expand human potential, and improve the world they inhabit.",
  motto: "Technology for people. Enterprise for humanity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
