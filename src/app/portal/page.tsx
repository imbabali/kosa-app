import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import { formatEventDateChip, formatEventTime, formatRelative, membershipStatus } from "@/lib/utils/format";

const QUICK_ACTIONS = [
  { key: "directory", label: "Directory", icon: "👥", href: "/portal/directory" },
  { key: "id-card", label: "Digital ID", icon: "🪪", href: "/portal/id-card" },
  { key: "events", label: "Events", icon: "📅", href: "/portal/events" },
  { key: "notices", label: "Notices", icon: "📢", href: "/portal/notices" },
  { key: "profile", label: "My Profile", icon: "👤", href: "/portal/profile" },
  { key: "feedback", label: "Feedback", icon: "💬", href: "/portal/feedback" },
];

export default async function PortalHome() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const greetingName =
    profile.display_name ??
    profile.full_name?.split(" ")[0] ??
    profile.email.split("@")[0];

  const status = membershipStatus(profile.membership_ends_at, profile.is_active);

  // Latest published notice (1)
  const { data: latestNotice } = await supabase
    .from("notices")
    .select("id, title, body, published_at")
    .eq("is_published", true)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Next upcoming event
  const { data: nextEvent } = await supabase
    .from("events")
    .select("id, title, starts_at, venue, city")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* HERO greeting */}
      <section className="rounded-3xl bg-brand p-8 text-on-dark sm:p-12">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
          {status === "active" ? "Active member" : status === "expired" ? "Membership expired" : "Inactive"}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Welcome back, <span className="text-accent">{greetingName}</span>.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-on-dark/75 sm:text-base">
          Proud Past. Stronger Together. Brighter Future.
        </p>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Quick actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.key}
              href={a.href}
              className="group rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
            >
              <div className="text-2xl">{a.icon}</div>
              <p className="mt-3 text-sm font-semibold text-ink group-hover:text-brand">
                {a.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* TWO COLS: Latest notice + Upcoming event */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Latest notice</h2>
            <Link href="/portal/notices" className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">
              View all →
            </Link>
          </div>
          {latestNotice ? (
            <Link href={`/portal/notices/${latestNotice.id}`} className="mt-4 block">
              <p className="text-sm font-semibold text-ink">{latestNotice.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{latestNotice.body}</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted">
                {formatRelative(latestNotice.published_at)}
              </p>
            </Link>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No notices yet.</p>
          )}
        </section>

        <section className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Next event</h2>
            <Link href="/portal/events" className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">
              View all →
            </Link>
          </div>
          {nextEvent ? (
            <Link href={`/portal/events/${nextEvent.id}`} className="mt-4 flex gap-4">
              <div className="shrink-0 rounded-xl bg-brand-deep p-3 text-center text-on-dark">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
                  {formatEventDateChip(nextEvent.starts_at).month}
                </p>
                <p className="font-display text-2xl font-bold leading-none">
                  {formatEventDateChip(nextEvent.starts_at).day}
                </p>
                <p className="text-[10px] uppercase text-on-dark/70">
                  {formatEventDateChip(nextEvent.starts_at).weekday}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{nextEvent.title}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {nextEvent.venue}{nextEvent.city ? `, ${nextEvent.city}` : ""}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {formatEventTime(nextEvent.starts_at)}
                </p>
              </div>
            </Link>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No upcoming events.</p>
          )}
        </section>
      </div>
    </div>
  );
}
