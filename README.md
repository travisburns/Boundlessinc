# Boundless Enterprises — Frontend

The Next.js frontend for the Boundless Enterprises central platform — the
holding company's public site, employee authentication, and enterprise portal.

> Backend API lives in a separate repository: **BoundlessInc-backend** (.NET).

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** design tokens (dark-first: corporate permanence, luxury
  restraint, cosmic geometry)
- Typed API client against the .NET backend

## Structure

```
src/
├── app/                      # routing only — thin route files
│   ├── (public)/             # public corporate site (Home, About, Companies, ...)
│   ├── (auth)/               # login, forgot / reset password
│   └── (portal)/             # authenticated enterprise portal
├── features/                 # feature implementations (the real work)
│   └── companies/
│       ├── api/              # companies.api.ts
│       ├── components/       # CompanyCard, CompanyGrid
│       └── types/            # company.types.ts
├── components/
│   ├── ui/                   # primitives (Button, Container, Section)
│   ├── layout/               # SiteHeader, SiteFooter
│   └── shared/               # Wordmark, cross-feature pieces
├── lib/
│   ├── api/                  # fetch client + error handling
│   ├── auth/                 # auth helpers (phase 1)
│   ├── constants/            # site config, navigation
│   ├── validation/ · formatting/ · utils/
├── hooks/
├── types/
└── styles/globals.css        # design tokens
```

**Rule:** `app/` is routing; `features/` is implementation. Route files stay
thin and compose feature components rather than holding business logic. Each
feature repeats the same internal shape (components, hooks, api, schemas, types)
close to the feature it serves.

## Getting started

Prerequisites: **Node 20+**. The backend API should be running (see
BoundlessInc-backend) for live data; the site renders gracefully without it.

```bash
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at the API
npm install
npm run dev                        # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint` ·
`npm run typecheck`.

## Environment

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the .NET API | `http://localhost:5080` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site (metadata) | `http://localhost:3000` |

## Roadmap

Public site + company directory (in progress) → auth → enterprise portal →
onboarding · payments · documents → integrations · intelligence. Each capability
is a first-class feature module.
