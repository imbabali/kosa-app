"use client";

import { useActionState } from "react";
import { submitFeedback, type FeedbackState } from "./actions";

const initial: FeedbackState = { status: "idle" };

export function FeedbackForm() {
  const [state, action, pending] = useActionState(submitFeedback, initial);

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-ink/5">
        <p className="font-display text-xl font-semibold text-ink">Thank you</p>
        <p className="mt-2 text-sm text-ink-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Category</span>
        <select
          name="category"
          className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="general">General</option>
          <option value="bug">Something broke</option>
          <option value="feature">Feature request</option>
          <option value="content">Content / data</option>
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          Your message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={2000}
          placeholder="Tell us what's on your mind…"
          className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-on-dark transition hover:bg-brand-deep disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
