import { PageShell, EmptyState } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/utils/format";

export const metadata = { title: "Feedback" };

export default async function AdminFeedbackPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("feedback")
    .select("*, profile:profile_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <PageShell title="Member feedback" back="/portal/admin" subtitle="Reverse-chronological. Most recent first.">
      {!items || items.length === 0 ? (
        <EmptyState title="No feedback yet" body="Submissions will show here." />
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f.id} className="rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {f.profile?.full_name ?? f.profile?.email ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {f.category} · {formatRelative(f.created_at)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${
                  f.status === "open" ? "bg-accent/20 text-brand-deep" : "bg-surface-muted text-ink-muted"
                }`}>
                  {f.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-ink">{f.message}</p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
