# CLAUDE.md — KOSA App

Canonical AI-assistant rules for this project. Other tools (Cursor, Codex, Aider) reach this file via `AGENTS.md`.

## Stack (locked)

- **Next.js 16+ (App Router)** — read `node_modules/next/dist/docs/` before writing any framework-touching code; the version evolves fast and your training data may be stale
- **TypeScript** (strict)
- **Tailwind v4** — no `tailwind.config.ts`; tokens live in `src/app/globals.css` via `@theme`
- **shadcn/ui** for primitives (added when first needed)
- **Supabase** (Postgres + Auth + Storage + Realtime) — wired in F2 (auth shell)
- **Vercel** — `main` auto-deploys to production; every PR gets a preview URL

## Brand tokens (never hardcode hex)

Defined in `src/app/globals.css` under `:root` and exposed via `@theme inline`. Use Tailwind utilities (e.g. `bg-brand`, `text-accent`).

| Token | Class prefix | Use |
|---|---|---|
| `--color-brand` (dark green) | `brand` | Primary surfaces, headers |
| `--color-brand-deep` | `brand-deep` | Pressed states |
| `--color-accent` (gold) | `accent` | Highlights, member badges, KOSA underline |
| `--color-ink` | `ink` | Primary text |
| `--color-ink-muted` | `ink-muted` | Secondary text |
| `--color-surface` | `surface` | Cards |
| `--color-surface-muted` | `surface-muted` | Page background |
| `--color-success` | `success` | Active-member pill |
| `--color-danger` | `danger` | Destructive actions |

## Folder layout

```
src/app/
  (marketing)/   public — no auth
  (portal)/      authenticated — gated by src/middleware.ts
  login/         auth page
  api/           server endpoints
src/components/
  ui/            shadcn primitives
  brand/         logo, wordmark, IDCard
  nav/           header, bottom nav
src/lib/
  supabase/      client factories: server, browser, middleware
  utils/
supabase/migrations/   versioned SQL
docs/superpowers/specs/   design specs (one per subsystem)
archive/   old kosa05-directory + original artefacts (not part of build)
```

## Conventions

- **RSC by default.** Mark `"use client"` only for forms, hooks, interactivity.
- **No raw hex in components.** Always use brand tokens.
- **No `any` casts on Supabase responses.** Generate types via `supabase gen types typescript`.
- **Server-side auth checks for protected operations.** Never trust the client.
- **Tests** colocated next to source (`*.test.ts`). Vitest for unit; Playwright for e2e (later).
- **One CSS file** (`globals.css`). Avoid component-scoped CSS unless unavoidable.

## Deployment

- `main` is production. Direct push is fine (per user's "always push to main" preference).
- Feature branches → PRs → preview URLs for changes that warrant review.

## Existing data

- 58 alumni records in Firestore (`kosa05-repository` Firebase project). Migration to Supabase scripted at cutover (Directory feature spec).
- Live old app: `https://imbabali.github.io/kosa05-directory/` — runs until new app is feature-complete.

## Read before editing

- `docs/superpowers/specs/2026-05-06-kosa-foundation-design.md` — full Foundation design
- `MEMORY.md` — institutional context

## Out of scope (don't add without a spec)

Payments, Gallery, News/blog, native mobile (Capacitor), Apple Sign-In, Email/password auth.

## Verification before claiming done

Run all three before reporting any feature complete:

```bash
npm run lint
npm run typecheck
npm run build
```

For UI changes, also load the deployed preview URL and verify visually.
