import { PageShell } from "@/components/ui/page-shell";
import { createNotice } from "./actions";

export const metadata = { title: "New notice" };

export default async function NewNoticePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <PageShell title="New notice" back="/portal/admin">
      <form action={createNotice} className="space-y-5 rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Title</span>
          <input
            name="title"
            required
            placeholder="Important update for all KOSA members"
            className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Body</span>
          <textarea
            name="body"
            required
            rows={10}
            placeholder="Write your announcement…"
            className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="pinned" className="h-5 w-5 rounded border-ink/20 text-brand focus:ring-brand" />
          <span className="text-sm text-ink">Pin to top of notices list</span>
        </label>
        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-on-dark transition hover:bg-brand-deep"
        >
          Publish notice
        </button>
      </form>
    </PageShell>
  );
}
