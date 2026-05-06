# KOSA Foundation Design

**Status:** Approved (in-session, 2026-05-06)
**Owner:** Ismail Mbabali
**Scope:** Foundation only — repo, stack, brand, deploy pipeline, auth shell. Feature subsystems (Directory, Digital ID, Events, Notices) get their own specs.

---

## Goal

Replace the single-file GitHub Pages prototype at `imbabali/kosa05-directory` with a modern, deployable, extensible alumni platform that can host both a public-facing alumni website and an authenticated member portal — and that ships with continuous deployment from day one.

The existing 58 records and the brand mockup (KOSA, Kibuli SS Old Students, est. 1945, dark green + gold) are non-negotiable inputs. Everything else is up for redesign.

## Locked decisions

| Area | Decision |
|---|---|
| Architecture | Progressive Web App on Vercel now; native iOS/Android shell via Capacitor in a later phase |
| MVP feature scope | Member Directory, Digital ID Card (with QR), Events & RSVP, Notices/Announcements |
| Web framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (Radix-based, copy-into-repo, Tailwind-styled) |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| Auth methods (v1) | Google OAuth + Phone OTP (SMS via Supabase). Apple Sign-In deferred to native-shell phase. |
| Public site | Lean landing + auth gate. Marketing content expands in later phase. |
| URL strategy | Single domain, route groups: `/` public, `/portal/*` member portal |
| Working URL (v1) | `kosa-app.vercel.app` (Vercel free subdomain). Custom domain swap later. |
| Repo | New GitHub repo `imbabali/kosa-app`. Old `kosa05-directory` repo and current Firebase database remain untouched until cutover. |
| Deployment | Vercel — `main` branch auto-deploys to production; PRs get preview URLs. |
| Package manager | npm (already installed). Switch to pnpm later if monorepo emerges. |

## Architecture

```
                       ┌──────────────────────────┐
                       │  Vercel (Next.js 15)     │
                       │  ┌────────────────────┐  │
   Public visitor ───▶ │  │ (marketing) routes │  │
                       │  └────────────────────┘  │
                       │  ┌────────────────────┐  │      ┌────────────────────┐
   Authed alumnus ───▶ │  │ (portal) routes    │ ─┼─────▶│  Supabase          │
                       │  │  middleware-gated  │  │      │  - Postgres        │
                       │  └────────────────────┘  │      │  - Auth (Google,   │
                       │  ┌────────────────────┐  │      │    Phone OTP)      │
                       │  │ /api/* routes      │ ─┼─────▶│  - Storage (avatars│
                       │  └────────────────────┘  │      │    + ID photos)    │
                       └──────────────────────────┘      │  - Realtime        │
                                                         └────────────────────┘
```

**Auth flow:**

1. Visitor lands on `/` (public marketing page).
2. Clicks "Sign in." Routes to `/login`.
3. Picks Google or Phone. Supabase handles OAuth callback / OTP verify.
4. On success, session cookie set via `@supabase/ssr` helpers; redirected to `/portal`.
5. `middleware.ts` enforces auth for `/portal/*`. Server components read user via `createClient()` SSR helper.

**Data flow:**

- Server components → `lib/supabase/server.ts` (service-role for admin paths only; user-scoped client otherwise).
- Client components → `lib/supabase/browser.ts` (anon key + user JWT).
- Row Level Security (RLS) on every table from day one.

## Folder layout

```
kosa-app/
├── .github/workflows/        # ci.yml: typecheck + lint on PR
├── .superpowers/             # gitignored — brainstorm artifacts
├── archive/                  # old kosa05-directory, CSV, mockup image, import-tools
├── docs/
│   └── superpowers/specs/    # design specs
├── public/                   # favicon, brand assets
├── src/
│   ├── app/
│   │   ├── (marketing)/      # public pages — landing, about, contact
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (portal)/         # authenticated pages
│   │   │   ├── layout.tsx    # member shell: bottom nav, header
│   │   │   ├── page.tsx      # /portal home (greeting, quick actions, events)
│   │   │   ├── directory/
│   │   │   ├── id-card/
│   │   │   ├── events/
│   │   │   └── notices/
│   │   ├── login/
│   │   ├── api/auth/callback/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── brand/            # logo, wordmark, IDCard
│   │   └── nav/              # BottomNav, Header
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts
│   │   │   ├── browser.ts
│   │   │   └── middleware.ts
│   │   └── utils/
│   ├── middleware.ts         # auth gate for /portal/*
│   └── styles/
├── supabase/
│   ├── migrations/           # versioned SQL
│   └── seed.sql              # dev seed data
├── .env.example
├── .gitignore
├── CLAUDE.md
├── MEMORY.md
├── README.md
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Brand tokens (from mockup)

| Token | Value | Use |
|---|---|---|
| `--brand-primary` | `#1F4E2D` | Headers, primary buttons, brand bar |
| `--brand-primary-dark` | `#143820` | Pressed states, deep contrast |
| `--brand-accent` | `#F2C94C` | Gold underline in logo, member-status pills, highlights |
| `--brand-on-dark` | `#FFFFFF` | Text on green |
| `--surface` | `#FFFFFF` | Card backgrounds |
| `--surface-muted` | `#F7F7F5` | Page background |
| `--ink` | `#0E0E10` | Primary text |
| `--ink-muted` | `#5C5C61` | Secondary text |
| `--success` | `#10B981` | "Active" badge |
| `--danger` | `#EF4444` | Destructive actions |

Typography pairing (TBD, locked in implementation):
- Display: a strong serif or condensed sans for headings (matches the heritage feel — candidates: Fraunces, Playfair Display, or Plus Jakarta Sans Bold)
- UI: Inter (variable, system-fallback)

## Data model (sketch — full DDL in feature specs)

```sql
-- Foundation tables (created in this phase, populated in feature phases)
profiles             id (= auth.uid), full_name, phone, email, avatar_url, member_id, year_joined, ...
events               id, title, starts_at, venue, capacity, ...
event_rsvps          event_id, profile_id, status
notices              id, title, body, published_at, audience
```

RLS:
- `profiles`: anyone authed can read; only owner can update; admins (separate `is_admin` flag or role) can insert/delete.
- `events`: authed read; admins write.
- `event_rsvps`: owner read/write; admins read all.
- `notices`: authed read; admins write.

## MVP phasing within this spec

The Foundation spec ships in **three thin slices** so we get value live fast:

**F1 — Hello-world deploy** (target: same day)
Scaffolded Next.js, Tailwind configured, brand tokens, public landing page with the KOSA mark, deployed to `kosa-app.vercel.app`. No data, no auth.

**F2 — Auth shell** (target: +1 day)
Supabase project provisioned, env wired, `/login` with Google + Phone OTP, `/portal` placeholder behind auth middleware, redirect flow.

**F3 — Member shell** (target: +1 day)
`/portal` home page with bottom nav, greeting using user's display name, empty Quick Actions grid (4 actions, "Coming soon" until their feature spec ships).

After F3, the Foundation is "live." The four feature specs (Directory, Digital ID, Events, Notices) follow in sequence.

## Out of scope for this spec (do not implement now)

- Payments / contributions
- Gallery
- News / blog
- In-app messaging
- Public alumni roll
- Donations
- Capacitor native shell
- Apple Sign-In
- Custom domain DNS swap

These are explicitly deferred to keep MVP shippable.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Supabase regions distant from Uganda → latency | Pick `eu-west-2` (London) or `af-south-1` (Cape Town) at project creation. Edge caching for read-heavy public pages. |
| Phone OTP cost spikes | Rate-limit at the API; require Google before phone for new accounts in v2 if abuse appears. |
| Cutover from old Firebase app | Old app at `imbabali.github.io/kosa05-directory` keeps running until new app is feature-complete; data migration is a one-time script. |
| Brand drift across phases | All UI uses tokens from `tailwind.config.ts`. No raw hex in components. |

## Acceptance criteria for "Foundation done"

1. ✅ `kosa-app.vercel.app` loads with KOSA-branded landing page
2. ✅ Sign-in works for both Google and Phone OTP
3. ✅ Authed user lands on `/portal` with their name in the greeting
4. ✅ All 58 alumni emails can sign in via Google when they next try (no migration needed for auth — Supabase creates the profile on first login; data migration runs in the Directory feature spec)
5. ✅ Brand tokens defined; bottom nav rendered; quick-action grid placeholder visible
6. ✅ CI runs typecheck + lint on PRs
7. ✅ `CLAUDE.md`, `MEMORY.md`, `README.md` present and accurate
