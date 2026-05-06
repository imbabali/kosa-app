import Link from "next/link";
import { PageShell, EmptyState } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/utils/format";

export const metadata = { title: "Notices" };

export default async function NoticesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [noticesRes, readsRes] = await Promise.all([
    supabase
      .from("notices")
      .select("id, title, body, pinned, published_at")
      .eq("is_published", true)
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false }),
    user
      ? supabase.from("notice_reads").select("notice_id").eq("profile_id", user.id)
      : Promise.resolve({ data: [] as { notice_id: string }[] }),
  ]);

  const notices = noticesRes.data ?? [];
  const readSet = new Set((readsRes.data ?? []).map((r) => r.notice_id));

  return (
    <PageShell title="Notices" subtitle="Announcements from the KOSA committee.">
      {notices.length === 0 ? (
        <EmptyState title="No notices yet" body="When admins post announcements, they'll show up here." />
      ) : (
        <ul className="space-y-3">
          {notices.map((n) => {
            const unread = !readSet.has(n.id);
            return (
              <li key={n.id}>
                <Link
                  href={`/portal/notices/${n.id}`}
                  className="block rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
                >
                  <div className="flex items-start gap-3">
                    {n.pinned && <span aria-label="Pinned">📌</span>}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {unread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                        )}
                        <p className={`truncate font-display text-lg font-semibold ${unread ? "text-ink" : "text-ink-muted"}`}>
                          {n.title}
                        </p>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{n.body}</p>
                      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted/70">
                        {formatRelative(n.published_at)}
                      </p>
                    </div>
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
