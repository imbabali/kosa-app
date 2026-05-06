import { PageShell } from "@/components/ui/page-shell";
import { createEvent } from "./actions";

export const metadata = { title: "New event" };

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <PageShell title="New event" back="/portal/admin">
      <form action={createEvent} className="space-y-5 rounded-2xl bg-surface p-6 ring-1 ring-ink/5">
        <Field name="title" label="Title" required placeholder="KOSA Annual General Meeting 2025" />
        <FieldArea name="description" label="Description" rows={5} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="starts_at" label="Starts" type="datetime-local" required />
          <Field name="ends_at" label="Ends" type="datetime-local" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="venue" label="Venue" placeholder="Kibuli Mosque grounds" />
          <Field name="city" label="City" placeholder="Kampala, Uganda" />
        </div>
        <Field name="capacity" label="Capacity" type="number" min={0} />
        <label className="flex items-center gap-3">
          <input type="checkbox" name="is_published" defaultChecked className="h-5 w-5 rounded border-ink/20 text-brand focus:ring-brand" />
          <span className="text-sm text-ink">Publish immediately (visible to all members)</span>
        </label>
        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-on-dark transition hover:bg-brand-deep"
        >
          Create event
        </button>
      </form>
    </PageShell>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function FieldArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <textarea
        {...rest}
        className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
