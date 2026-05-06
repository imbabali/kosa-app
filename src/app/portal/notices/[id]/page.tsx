import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("notices").select("title").eq("id", id).maybeSingle();
  return { title: data?.title ?? "Notice" };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (!notice) notFound();

  // Mark as read (idempotent — primary key prevents duplicates)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("notice_reads")
      .upsert(
        { notice_id: id, profile_id: user.id },
        { onConflict: "notice_id,profile_id", ignoreDuplicates: true },
      );
  }

  return (
    <PageShell title={notice.title} back="/portal/notices">
      <div className="mx-auto max-w-2xl rounded-2xl bg-surface p-8 ring-1 ring-ink/5">
        {notice.pinned && (
          <span className="inline-block rounded-full bg-accent/20 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-brand-deep">
            📌 Pinned
          </span>
        )}
        <p className={notice.pinned ? "mt-3" : "" + " text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted"}>
          Published {formatRelative(notice.published_at)}
        </p>
        <article className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink">
          {notice.body}
        </article>
      </div>
    </PageShell>
  );
}
