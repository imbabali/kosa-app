# MEMORY — KOSA App

Institutional knowledge for the KOSA Alumni Platform. The kind of context a new contributor (or AI) needs to make sensible decisions, beyond what the code itself tells you.

## What is KOSA

**Kibuli Secondary School Old Students Association.** Established 1945. Kibuli is a Muslim-founded secondary school in Kampala, Uganda.

This project is the digital platform for the Class of 2005 (KOSA05) alumni — currently 58 known members. The platform is built so it can later extend to other class years if the school's broader alumni body adopts it.

## Brand

- **Colours:** dark green `#1F4E2D` + gold `#F2C94C` on white.
- **Wordmark:** "KOSA" — the **O** is gold-accented (the original mockup uses a heritage-style green-and-gold treatment).
- **Heritage tag:** "Kibuli SS Old Students • Since 1945".
- **Tagline:** "Proud Past. Stronger Together. Brighter Future."

The mockup that drives the design is in `archive/PHOTO-2026-05-06-16-29-33.jpg`.

## Why we're rebuilding

The original app at `imbabali.github.io/kosa05-directory` is a single-file HTML page with Firebase Auth + Firestore. It works for the directory but cannot grow into the full alumni-platform vision (Digital ID, Events, Notices, eventually payments + gallery + news) without becoming unmaintainable.

We're rebuilding on Next.js + Supabase + Vercel so subsequent features can be added cleanly without rewriting.

## What's in `archive/`

Preserved for reference; not part of the build:

- `kosa05-directory/` — the original repo (still deployed at imbabali.github.io)
- `Contact Information.csv` — original 2022 Google Form responses (**PII — gitignored**)
- `import-tools/` — Node scripts used to import the CSV into Firestore (one-time use, kept for reference)
- `PHOTO-2026-05-06-16-29-33.jpg` — the design mockup driving the brand and feature set

## Live data state (as of 2026-05-06)

Firestore (`kosa05-repository` Firebase project) — **58 records**:
- 39 are `legacy_*` — alumni in CSV who have not yet signed in
- 19 are real-user records (Google UID-keyed) — alumni who have signed in
- 11 of the 19 also carry merged 2022 archive data (consolidated from CSV imports)

Auth: Google Sign-In only.

## Cutover plan

1. Build new app on Supabase
2. Once feature-complete, run a one-time data migration (Firestore → Supabase Postgres)
3. Switch `imbabali.github.io/kosa05-directory` to redirect to the new domain
4. Old Firebase project becomes read-only; kept for ~3 months for reference

## Constraints from the user (durable)

- **Always push to main** — direct push is the deploy
- **No localhost servers for the product** — use Vercel preview URLs for review
- **Brand mockup is non-negotiable** — don't redesign the look
- **Build incrementally to a live URL** — small, deployable slices
- **Data integrity** — only verified values; no inferred or computed data; respect "Empty Means Empty"

## Domain

Working URL: https://kosa-app.vercel.app (Vercel free subdomain). Custom domain to be picked later — strong candidate: `kosa.app` if available.

## Pointers

- Foundation design: `docs/superpowers/specs/2026-05-06-kosa-foundation-design.md`
- Project rules: `CLAUDE.md`
- Brand tokens: `src/app/globals.css` (search `--color-brand`)
- Original app for reference: https://imbabali.github.io/kosa05-directory/
