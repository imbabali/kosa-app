import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate, formatEventTime } from "@/lib/utils/format";
import { RsvpButtons } from "./rsvp-buttons";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("title").eq("id", id).maybeSingle();
  return { title: data?.title ?? "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: myRsvp } = user
    ? await supabase
        .from("event_rsvps")
        .select("status")
        .eq("event_id", id)
        .eq("profile_id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: attendees } = await supabase
    .from("event_rsvps")
    .select("status, profile:profile_id(full_name, email, avatar_url, id)")
    .eq("event_id", id)
    .eq("status", "going")
    .limit(50);

  return (
    <PageShell title={event.title} back="/portal/events">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
          <dl className="space-y-3 text-sm">
            <Row icon="📅" label="When">
              {formatEventDate(event.starts_at)} ·{" "}
              {formatEventTime(event.starts_at)}
              {event.ends_at && ` – ${formatEventTime(event.ends_at)}`}
            </Row>
            {(event.venue || event.city) && (
              <Row icon="📍" label="Where">
                {[event.venue, event.city].filter(Boolean).join(", ")}
              </Row>
            )}
            {event.capacity && (
              <Row icon="👥" label="Capacity">{event.capacity} alumni</Row>
            )}
          </dl>
          {event.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink">
              {event.description}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`/portal/events/${event.id}/ics`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-ink/15 px-5 text-xs font-semibold text-ink transition hover:bg-surface-muted"
            >
              📥 Add to calendar
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
          <h2 className="font-display text-lg font-semibold text-ink">Will you be there?</h2>
          <p className="mt-1 text-xs text-ink-muted">Let your classmates know.</p>
          <div className="mt-4">
            <RsvpButtons eventId={event.id} initialStatus={myRsvp?.status ?? null} />
          </div>
        </div>

        {attendees && attendees.length > 0 && (
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
            <h2 className="font-display text-lg font-semibold text-ink">
              Going ({attendees.length})
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {attendees
                .filter((a) => a.profile)
                .map((a) => (
                  <li key={a.profile!.id}>
                    <Link
                      href={`/portal/directory/${a.profile!.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-surface-muted ring-1 ring-brand/15">
                        {a.profile!.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.profile!.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand">
                            {(a.profile!.full_name ?? a.profile!.email)[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <p className="truncate text-xs font-medium text-ink">
                        {a.profile!.full_name ?? a.profile!.email}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Row({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[28px_90px_1fr] items-center gap-3">
      <span aria-hidden>{icon}</span>
      <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}
