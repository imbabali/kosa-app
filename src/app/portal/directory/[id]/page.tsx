import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .maybeSingle();
  return { title: data?.full_name ?? data?.email ?? "Member" };
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: m, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!m || error) notFound();

  const work = m.workplace ?? m.legacy_business_details ?? "";
  const where = m.residence ?? m.legacy_address ?? "";
  const initial = (m.full_name ?? m.email)[0]?.toUpperCase() ?? "?";

  const rows: Array<{ icon: string; label: string; value: React.ReactNode }> = [];
  if (m.phone) rows.push({ icon: "📞", label: "Phone", value: <a className="text-brand underline" href={`tel:${m.phone}`}>{m.phone}</a> });
  rows.push({ icon: "📧", label: "Email", value: <a className="text-brand underline" href={`mailto:${m.email}`}>{m.email}</a> });
  if (where) rows.push({ icon: "🏠", label: "Residence", value: where });
  if (work) rows.push({ icon: "💼", label: "Place of work", value: work });
  if (m.focus) rows.push({ icon: "🎯", label: "Focus", value: m.focus });
  if (m.details) rows.push({ icon: "📝", label: "Details", value: m.details });
  if (m.legacy_timestamp) rows.push({ icon: "📅", label: "Joined directory", value: m.legacy_timestamp });

  return (
    <PageShell title={m.full_name ?? m.email} back="/portal/directory">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-surface p-8 ring-1 ring-ink/5 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-muted ring-2 ring-brand/20">
              {m.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-brand">
                  {initial}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {m.full_name ?? m.email}
              </h2>
              {m.member_id && (
                <p className="mt-1 font-mono text-xs text-ink-muted">{m.member_id}</p>
              )}
              {m.is_admin && (
                <span className="mt-2 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-deep">
                  Admin
                </span>
              )}
            </div>
          </div>

          <dl className="mt-8 divide-y divide-ink/5">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[28px_120px_1fr] items-start gap-3 py-3">
                <span aria-hidden>{r.icon}</span>
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                  {r.label}
                </dt>
                <dd className="text-sm text-ink break-words">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Information self-reported by the member. <Link href="/portal/feedback" className="underline">Report a problem</Link>.
        </p>
      </div>
    </PageShell>
  );
}
