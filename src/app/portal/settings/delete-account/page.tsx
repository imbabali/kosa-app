import { PageShell } from "@/components/ui/page-shell";
import { deleteMyAccount } from "./actions";

export const metadata = { title: "Delete account" };

export default async function DeleteAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <PageShell title="Delete my account" back="/portal/more">
      <div className="mx-auto max-w-xl rounded-2xl bg-surface p-8 ring-1 ring-danger/20">
        <p className="font-display text-lg font-semibold text-danger">This is permanent.</p>
        <p className="mt-2 text-sm text-ink">
          Deleting your account removes your profile, RSVPs, feedback, and read receipts. The directory will no longer show you. You can sign up again later, but your historical data will be gone.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          To confirm, type <strong>DELETE</strong> in the field below.
        </p>
        <form action={deleteMyAccount} className="mt-6 space-y-4">
          <input
            name="confirm"
            placeholder="Type DELETE"
            className="w-full rounded-lg border border-danger/30 bg-surface px-4 py-3 text-base text-ink focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/20"
          />
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-danger px-8 text-sm font-semibold text-on-dark transition hover:opacity-90"
          >
            Delete my account
          </button>
        </form>
      </div>
    </PageShell>
  );
}
