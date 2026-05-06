# Google OAuth Setup — KOSA App

**Status:** Code wired (commit pending); awaiting GCP credentials.
**Why:** unblocks 52 of 58 alumni from the 2-emails-per-hour built-in rate limit.

## Browser step (one-time, ~3 min)

Google does not expose an API for OAuth client creation. This is the only browser-required step.

1. Open `https://console.cloud.google.com/apis/credentials?project=kosa05-repository`
2. **OAuth consent screen** (left nav) — if not already set up:
   - User type: **External**
   - App name: `KOSA`
   - User support email: your email
   - Save
3. Back to **Credentials** → **+ Create Credentials → OAuth client ID**
4. Application type: **Web application**
5. Name: `KOSA App (Supabase)`
6. **Authorised JavaScript origins:**
   - `https://zehlttaqanascmpyvuku.supabase.co`
   - `https://kosa-app.vercel.app`
7. **Authorised redirect URIs:**
   - `https://zehlttaqanascmpyvuku.supabase.co/auth/v1/callback`
8. Click **Create** — copy the Client ID and Client secret

## CLI steps (after credentials arrive)

```bash
# 1. Set the secrets in Supabase (server-side, encrypted)
supabase secrets set \
  SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<paste> \
  SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<paste>

# 2. Push the [auth.external.google] config (already in supabase/config.toml)
supabase config push --yes

# 3. (UI is already shipped — nothing to redeploy)
```

The "Continue with Google" button on `/login` starts working immediately.

## How it works for the 58 migrated alumni

When an alumnus signs in with Google for the first time:
- Supabase OAuth flow returns user info from Google (email, sub, name, etc.)
- Supabase finds the existing `auth.users` row matching the email (created by migration with `email_confirm: true`)
- Supabase **auto-links** the Google identity to that existing user (because email is verified on both sides)
- They land in `/portal` with their fully migrated profile data

No duplicate accounts. No data loss.

## Coverage

| Provider | Alumni | Sign-in path |
|---|---|---|
| `gmail.com` | 52 | Google OAuth (instant, no email) |
| `yahoo.com` / `yahoo.co.uk` | 6 | Magic link (≈3 hours full onboarding under 2/hr cap) |

## Future

- **Custom SMTP for magic-link** (e.g. SendGrid Single Sender) — only needed if rate limit becomes painful for the 6 yahoo users. Skip for now.
- **Phone OTP** — needs Twilio setup; deferred until the alumni base requests it.
