import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand text-on-dark">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Kibuli SS Old Students &middot; Since 1945
            </span>
          </div>

          <h1 className="mt-10 text-center font-display text-6xl font-semibold leading-none tracking-tight sm:text-7xl md:text-8xl">
            <span className="relative inline-block">
              KOSA
              <span
                aria-hidden
                className="absolute -bottom-3 left-1 right-1 h-1.5 rounded-full bg-accent sm:h-2"
              />
            </span>
          </h1>

          <p className="mx-auto mt-12 max-w-xl text-balance text-center font-display text-2xl font-light italic leading-snug text-on-dark/90 sm:text-3xl">
            Proud Past. Stronger Together. Brighter Future.
          </p>

          <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-on-dark/65 sm:text-base">
            The home of Kibuli Secondary School alumni — directory, events, and
            your digital membership.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-brand-deep transition hover:bg-accent/90"
            >
              Enter the directory &rarr;
            </Link>
            <Link
              href="#about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-on-dark/20 px-8 text-sm font-medium text-on-dark/85 transition hover:border-on-dark/40 hover:bg-on-dark/5"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section id="about" className="bg-surface-muted py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted sm:text-xs">
              What KOSA brings together
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              An alumni network, in your pocket.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <FeatureCard
              tone="brand"
              title="Member Directory"
              body="Find and reach every classmate — phone, email, where they are now, what they do."
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9c0-3.314 3.134-6 7-6s7 2.686 7 6H3z" />
                </svg>
              }
            />
            <FeatureCard
              tone="accent"
              title="Digital ID"
              body="Carry your KOSA membership in your pocket. QR-coded, always with you."
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1h2v2H6V6zm6 0h2v2h-2V6zM6 12h2v2H6v-2zm6 0h2v2h-2v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <FeatureCard
              tone="success"
              title="Events & Reunions"
              body="Reunions, AGMs, fundraisers — RSVP and stay close, even when you're far."
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm-1 6v8h12V8H4z" />
                </svg>
              }
            />
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-on-dark transition hover:bg-brand-deep"
            >
              Sign in to enter
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-deep py-10 text-on-dark/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm">
            <span className="font-semibold text-on-dark">KOSA</span> &middot;
            Kibuli SS Old Students Association &middot; Est. 1945
          </p>
          <Link
            href="/login"
            className="text-[10px] uppercase tracking-[0.22em] transition hover:text-accent sm:text-xs"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  tone,
  title,
  body,
  icon,
}: {
  tone: "brand" | "accent" | "success";
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  const toneClasses = {
    brand: "bg-brand/10 text-brand",
    accent: "bg-accent/20 text-brand-deep",
    success: "bg-success/15 text-success",
  }[tone];

  return (
    <div className="rounded-2xl bg-surface p-8 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-ink/10">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${toneClasses}`}
      >
        {icon}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}
