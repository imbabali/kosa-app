import Link from "next/link";
import { PageShell, EmptyState } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatEventDateChip, formatEventTime } from "@/lib/utils/format";

export const metadata = { title: "Events" };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "past" ? "past" : "upcoming";

  const supabase = await createClient();
  const now = new Date().toISOString();

  const query = supabase
    .from("events")
    .select("id, title, starts_at, ends_at, venue, city, capacity, cover_image_url")
    .eq("is_published", true)
    .order("starts_at", { ascending: tab === "upcoming" });

  const { data: events } = tab === "upcoming"
    ? await query.gte("starts_at", now)
    : await query.lt("starts_at", now);

  return (
    <PageShell
      title="Events & Reunions"
      subtitle="AGMs, fundraisers, reunions. RSVP and add to your calendar."
    >
      <div className="mb-6 flex gap-2">
        <Tab href="/portal/events?tab=upcoming" active={tab === "upcoming"}>Upcoming</Tab>
        <Tab href="/portal/events?tab=past" active={tab === "past"}>Past</Tab>
      </div>

      {!events || events.length === 0 ? (
        <EmptyState
          title={tab === "upcoming" ? "No upcoming events" : "No past events"}
          body={tab === "upcoming" ? "Check back soon — admins will post events here." : "Past events will show up here once they've happened."}
        />
      ) : (
        <ul className="space-y-3">
          {events.map((e) => {
            const chip = formatEventDateChip(e.starts_at);
            return (
              <li key={e.id}>
                <Link
                  href={`/portal/events/${e.id}`}
                  className="flex gap-5 rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
                >
                  <div className="shrink-0 rounded-xl bg-brand-deep p-3 text-center text-on-dark">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
                      {chip.month}
                    </p>
                    <p className="font-display text-3xl font-bold leading-none">{chip.day}</p>
                    <p className="text-[10px] uppercase text-on-dark/70">{chip.weekday}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-ink">{e.title}</p>
                    {(e.venue || e.city) && (
                      <p className="mt-1 text-sm text-ink-muted">
                        📍 {[e.venue, e.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-ink-muted">
                      🕐 {formatEventTime(e.starts_at)}
                      {e.ends_at && ` – ${formatEventTime(e.ends_at)}`}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
        active ? "bg-brand text-on-dark" : "bg-surface text-ink-muted ring-1 ring-ink/10 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
