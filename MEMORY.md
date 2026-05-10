# MEMORY — KOSA App

Institutional knowledge for the KOSA Alumni Platform. The kind of context a new contributor (or AI) needs to make sensible decisions, beyond what the code itself tells you.

## What is KOSA

**Kibuli Secondary School Old Students Association.** Established 1945. Kibuli is a Muslim-founded secondary school in Kampala, Uganda.

This project is the digital platform for the Class of 2005 (KOSA05) alumni — currently 58 known members. The platform is built so it can later extend to other class years if the school's broader alumni body adopts it.

## Brand

- **Colours:** dark green `#1F4E2D` + gold `#F2C94C` on white.
- **Wordmark:** "KOSA" with a gold underline (heritage-style green-and-gold treatment in the original mockup).
- **Heritage tag:** "Kibuli SS Old Students • Since 1945".
- **Tagline:** "Proud Past. Stronger Together. Brighter Future."

The mockup that drives the design lives in `archive/PHOTO-2026-05-06-16-29-33.jpg`.

## Why we rebuilt

The original app at `imbabali.github.io/kosa05-directory` is a single-file HTML page with Firebase Auth + Firestore. It worked for the directory but couldn't grow into the full alumni-platform vision (Digital ID, Events, Notices, eventually payments) without becoming unmaintainable. We rebuilt on Next.js 16 + Supabase + Vercel so subsequent features add cleanly.

## What's in `archive/`

Preserved for reference; not part of the build:

- `kosa05-directory/` — the original repo (still deployed at imbabali.github.io)
- `Contact Information.csv` — original 2022 Google Form responses (**PII — gitignored**)
- `import-tools/` — Node scripts that built the platform's initial state:
  - `import-csv.mjs` — CSV → Firestore (2022 data)
  - `consolidate.mjs` — collapsed legacy_* + real-user duplicates in Firestore
  - `migrate-firestore-to-supabase.mjs` — Firestore → Supabase Postgres (cutover script)
  - `test-login.mjs` — verifies admin.generateLink works for arbitrary alumni
- `PHOTO-2026-05-06-16-29-33.jpg` — the mockup that drives the brand and feature set

## Live state (current)

**Production URL:** https://kosa-app.vercel.app (auto-deploys from `main`)
**Repo:** https://github.com/imbabali/kosa-app
**Supabase project:** `kosa-app` in `eu-west-1`, ref `zehlttaqanascmpyvuku`
**Vercel project:** `kosa-app` (team `ismail-mbabalis-projects`)

**Database (Supabase Postgres):**
- 58 profiles · 1 admin (imbabali@gmail.com)
- 1 event (KOSA AGM 2026 — June 28, Kampala)
- 1 notice (Welcome — pinned)
- All 58 alumni have `auth.users` rows with `email_confirmed_at` set; ready to log in.

**Email-provider mix:**
- 52 alumni on `gmail.com` → Google OAuth (when wired) bypasses email rate limit
- 6 on `yahoo.com` / `yahoo.co.uk` → magic link (covered by Supabase 2/hour built-in)

## Auth methods status

| Method | Status |
|---|---|
| Email magic link | ✅ live |
| Google OAuth | UI live, Supabase config staged; awaiting `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (one-time GCP Console step). See `docs/superpowers/specs/2026-05-06-google-oauth-setup.md`. |
| Phone OTP | deferred (needs Twilio signup) |
| Apple Sign-In | deferred (native phase) |

## Cutover from old app

1. ✅ Build new app on Supabase (done — full MVP shipped)
2. ✅ One-time data migration (Firestore → Supabase) — 58 profiles + 57 new auth users created on 2026-05-06
3. ⏳ Switch `imbabali.github.io/kosa05-directory` to redirect to new domain (manual edit on the old repo)
4. ⏳ Retire old Firebase project — keep read-only for ~3 months for reference

## Features shipped (MVP)

Per `docs/superpowers/specs/2026-05-06-feature-inventory.md`:

- Public site: landing + about + contact + privacy + terms + branded 404
- Auth: email magic link, sign out, /portal gate via `proxy.ts`
- Member portal home: greeting, quick-actions grid, latest notice + next event preview
- Profile: view + edit (full_name, residence, workplace, focus, etc.) + avatar upload + completeness %
- Directory: list with cross-field search · member detail with tap-to-call/email
- Digital ID: QR-coded card with `KOSA{year}{seq}` member ID, validity, status
- Events: upcoming/past tabs · detail with RSVP (going/maybe/not) · attendees · `.ics` download
- Notices: list with unread badges · detail auto-marks-read
- Feedback: member-to-admin form
- More menu: settings hub · admin link · account deletion
- Admin: dashboard tiles · create event · create notice · view all feedback (gated by `is_admin`)
- PWA manifest, branded favicon/apple-icon/OG share image

## Constraints from the user (durable)

- **Always push to main** — direct push is the deploy
- **CLI-first** — for everything, always use the CLI unless it's absolutely impossible (Google OAuth client creation, Twilio signup are the few genuinely browser-required steps)
- **No localhost servers for the product** — use Vercel preview URLs for review (the local visual-companion brainstorm tool is a separate, internal-only thing)
- **Brand mockup is non-negotiable** — don't redesign the look
- **Build incrementally to a live URL** — small, deployable slices
- **Data integrity** — only verified values; no inferred or computed data; respect "Empty Means Empty"
- **Trust to execute** — once decisions are made the user expects autonomous execution to a live state

## Domain

Working URL: https://kosa-app.vercel.app (Vercel free subdomain). Custom domain to be picked later — strong candidate: `kosa.app` if available.

## Pointers

- Project rules: `CLAUDE.md`
- Foundation design: `docs/superpowers/specs/2026-05-06-kosa-foundation-design.md`
- Feature inventory: `docs/superpowers/specs/2026-05-06-feature-inventory.md`
- Google OAuth setup (pending CLI flip): `docs/superpowers/specs/2026-05-06-google-oauth-setup.md`
- Brand tokens: `src/app/globals.css` (search `--color-brand`)
- Database schema: `supabase/migrations/20260506164733_initial_schema.sql`
- Original app for reference: https://imbabali.github.io/kosa05-directory/
