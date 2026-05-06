"use client";

import { useActionState, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmail, type SignInState } from "./actions";
import { createClient } from "@/lib/supabase/browser";

const initialState: SignInState = { status: "idle" };

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/portal";

  const [state, action, pending] = useActionState(signInWithEmail, initialState);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthPending, startOauth] = useTransition();

  function handleGoogle() {
    setOauthError(null);
    startOauth(async () => {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) setOauthError(error.message);
    });
  }

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-ink/5 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden>
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0l-3.6-3.6a1 1 0 011.4-1.4L8.6 12l6.7-6.7a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          Check your email
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          We sent a magic link to <strong>{state.email}</strong>. Click the link in
          the email to sign in.
        </p>
        <p className="mt-4 text-xs text-ink-muted">
          The link expires in 1 hour. Didn&rsquo;t get it? Check spam, or{" "}
          <a href="/login" className="text-brand underline">try again</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface p-8 ring-1 ring-ink/5 shadow-sm">
      <h2 className="font-display text-2xl font-semibold text-ink">Sign in</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Use Google for the fastest sign-in, or get a magic link by email.
      </p>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={oauthPending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-surface text-sm font-semibold text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleG />
        {oauthPending ? "Redirecting to Google…" : "Continue with Google"}
      </button>
      {oauthError && (
        <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
          {oauthError}
        </p>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted">
        <div className="h-px flex-1 bg-ink/10" />
        or
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      {/* Email magic link */}
      <form action={action}>
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
            Email address
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        {state.status === "error" && state.error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-dark transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending magic link…" : "Send magic link"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Phone sign-in coming soon.
      </p>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.614z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
