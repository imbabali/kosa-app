# KOSA App

Modern alumni platform for **Kibuli SS Old Students Association** (est. 1945) — Class of 2005 cohort. Member directory, digital ID cards, events, and notices, built as a Progressive Web App and deployed on Vercel.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **Supabase** — Postgres, Auth (Google + Phone OTP), Storage, Realtime
- **Vercel** — production deploys from `main`, preview URLs on PRs

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```

App runs at `http://localhost:3000`.

## Project structure

See `CLAUDE.md` for the canonical conventions. High level:

- `src/app/(marketing)/` — public pages
- `src/app/(portal)/` — authenticated app
- `src/lib/supabase/` — Supabase client factories
- `supabase/migrations/` — versioned SQL
- `docs/superpowers/specs/` — design docs
- `archive/` — original kosa05-directory artefacts (reference only, not built)

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Production

- Live: https://kosa-app.vercel.app
- Old app (read-only after cutover): https://imbabali.github.io/kosa05-directory/

## Contributing

1. Read `CLAUDE.md` first
2. Check the relevant spec in `docs/superpowers/specs/` for the subsystem you're touching
3. `npm run lint && npm run typecheck && npm run build` must pass before merge
