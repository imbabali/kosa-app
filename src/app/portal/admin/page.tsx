import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: members },
    { count: events },
    { count: notices },
    { count: feedbackOpen },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("notices").select("id", { count: "exact", head: true }),
    supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);

  const tiles = [
    { label: "Members", count: members ?? 0, href: "/portal/directory", color: "bg-brand text-on-dark" },
    { label: "Events", count: events ?? 0, href: "/portal/events", color: "bg-brand-deep text-on-dark" },
    { label: "Notices", count: notices ?? 0, href: "/portal/notices", color: "bg-accent text-brand-deep" },
    { label: "Open feedback", count: feedbackOpen ?? 0, href: "/portal/admin/feedback", color: "bg-success text-on-dark" },
  ];

  return (
    <PageShell title="Admin" subtitle="Manage events, notices, and member feedback.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`rounded-2xl p-5 transition hover:opacity-90 ${t.color}`}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-80">{t.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{t.count}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/portal/admin/events/new"
          className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
        >
          <p className="font-display text-lg font-semibold text-ink">Create event →</p>
          <p className="mt-1 text-sm text-ink-muted">Reunions, AGMs, fundraisers.</p>
        </Link>
        <Link
          href="/portal/admin/notices/new"
          className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
        >
          <p className="font-display text-lg font-semibold text-ink">Post notice →</p>
          <p className="mt-1 text-sm text-ink-muted">Broadcast announcement to all members.</p>
        </Link>
      </div>
    </PageShell>
  );
}
