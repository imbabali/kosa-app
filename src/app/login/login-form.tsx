"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmail, type SignInState } from "./actions";

const initialState: SignInState = { status: "idle" };

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/portal";

  const [state, action, pending] = useActionState(signInWithEmail, initialState);

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-ink/5 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6"
            aria-hidden
          >
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
          We sent a magic link to <strong>{state.email}</strong>.
          Click the link in the email to sign in.
        </p>
        <p className="mt-4 text-xs text-ink-muted">
          The link expires in 1 hour. Didn&rsquo;t get it? Check spam, or{" "}
          <a href="/login" className="text-brand underline">
            try again
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl bg-surface p-8 ring-1 ring-ink/5 shadow-sm"
    >
      <h2 className="font-display text-2xl font-semibold text-ink">
        Sign in
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Enter your email and we&rsquo;ll send you a magic link.
      </p>

      <input type="hidden" name="next" value={next} />

      <label className="mt-6 block">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          Email address
        </span>
        <input
          type="email"
          name="email"
          required
          autoFocus
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
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-dark transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending magic link…" : "Send magic link"}
      </button>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Google &amp; Phone sign-in are coming soon.
      </p>
    </form>
  );
}
