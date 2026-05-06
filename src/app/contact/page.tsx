import Link from "next/link";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand py-6 text-on-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
            <span className="relative inline-block">
              KOSA
              <span aria-hidden className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent" />
            </span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-on-dark/70 hover:text-on-dark">
            ← Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Get in touch
        </h1>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted">Email</p>
            <a href="mailto:kosa.alumni@gmail.com" className="mt-2 block font-display text-lg font-semibold text-brand">
              kosa.alumni@gmail.com
            </a>
            <p className="mt-2 text-xs text-ink-muted">For general enquiries, partnerships, donations.</p>
          </div>
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink/5 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-muted">Address</p>
            <p className="mt-2 font-display text-base font-semibold text-ink">
              Kibuli Secondary School<br />
              Kibuli Hill, Kampala<br />
              Uganda
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-brand p-8 text-on-dark">
          <h2 className="font-display text-xl font-semibold">Are you a Class of 2005 alumnus?</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-dark/85">
            Sign in with your email to join the directory, register for events, and receive announcements.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-brand-deep transition hover:bg-accent/90"
          >
            Sign in →
          </Link>
        </div>
      </main>

      <footer className="bg-brand-deep py-10 text-on-dark/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm"><span className="font-semibold text-on-dark">KOSA</span> · Est. 1945</p>
          <Link href="/" className="text-[10px] uppercase tracking-[0.22em] hover:text-accent">← Home</Link>
        </div>
      </footer>
    </div>
  );
}
