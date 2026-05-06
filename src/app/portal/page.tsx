import { createClient } from "@/lib/supabase/server";

export default async function PortalHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const greetingName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "alumnus";

  const quickActions = [
    { key: "directory", label: "Member Directory", state: "Coming soon" },
    { key: "id-card", label: "Digital ID Card", state: "Coming soon" },
    { key: "events", label: "Events & Reunions", state: "Coming soon" },
    { key: "notices", label: "Notices", state: "Coming soon" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-3xl bg-brand p-8 text-on-dark sm:p-12">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
          Active member
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Welcome back, <span className="text-accent">{greetingName}</span>.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-on-dark/75 sm:text-base">
          You&rsquo;re signed in to the KOSA member portal. Features are rolling
          out one at a time — Directory is up next.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Quick actions
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <div
              key={a.key}
              className="rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm"
            >
              <p className="text-sm font-semibold text-ink">{a.label}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                {a.state}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-surface-muted p-6 text-sm text-ink-muted">
        <p>
          <strong className="text-ink">Heads up.</strong> The full member shell
          (digital ID card, events feed, notices) lands in the next phase. Until
          then, this is the foundation: secure sign-in via magic link, and the
          shell ready to host features.
        </p>
      </section>
    </div>
  );
}
