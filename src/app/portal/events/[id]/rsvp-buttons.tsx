"use client";

import { useState, useTransition } from "react";
import type { Database } from "@/lib/supabase/types";
import { setRsvp, clearRsvp } from "./rsvp-actions";

type RsvpStatus = Database["public"]["Enums"]["rsvp_status"];

const OPTIONS: Array<{ key: RsvpStatus; label: string; tone: string }> = [
  { key: "going", label: "Going", tone: "bg-success text-on-dark" },
  { key: "maybe", label: "Maybe", tone: "bg-accent text-brand-deep" },
  { key: "not_going", label: "Can't make it", tone: "bg-danger/15 text-danger" },
];

export function RsvpButtons({
  eventId,
  initialStatus,
}: {
  eventId: string;
  initialStatus: RsvpStatus | null;
}) {
  const [status, setStatus] = useState<RsvpStatus | null>(initialStatus);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(next: RsvpStatus | null) {
    setError(null);
    start(async () => {
      const res = next === null
        ? await clearRsvp(eventId)
        : await setRsvp(eventId, next);
      if ("error" in res && res.error) setError(res.error);
      else setStatus(next);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const active = status === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => handle(active ? null : o.key)}
              disabled={pending}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                active ? o.tone : "bg-surface text-ink-muted ring-1 ring-ink/10 hover:ring-brand/30"
              }`}
            >
              {o.label}
              {active && " ✓"}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
