import Link from "next/link";

export const metadata = {
  title: "About",
  description: "About Kibuli SS Old Students Association — alumni network since 1945.",
};

export default function AboutPage() {
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
          <Link href="/login" className="text-xs uppercase tracking-[0.22em] text-on-dark/70 hover:text-on-dark">
            Sign in →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Kibuli SS Old Students Association
        </h1>
        <p className="mt-6 font-display text-2xl italic text-ink-muted">
          Proud Past. Stronger Together. Brighter Future.
        </p>

        <div className="prose-sm mt-12 space-y-6 text-base leading-relaxed text-ink">
          <p>
            <strong>KOSA</strong> is the alumni network of Kibuli Secondary School, a Muslim-founded institution in Kampala, Uganda established in 1945. We connect generations of Kibuli alumni — from the foundation cohorts of the 1940s through to today&rsquo;s graduates — across geographies and professions.
          </p>
          <p>
            This platform is the home of the Class of 2005 alumni cohort. It hosts our member directory, digital membership cards, events, and announcements. The platform is built so any class year can adopt it as the school&rsquo;s alumni body grows online.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">What we do</h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc"><strong>Connect alumni</strong> — searchable member directory with up-to-date contact info</li>
            <li className="list-disc"><strong>Convene reunions</strong> — annual general meetings, fundraisers, and special gatherings</li>
            <li className="list-disc"><strong>Communicate</strong> — committee announcements reach members directly via the in-app notices feed</li>
            <li className="list-disc"><strong>Carry your identity</strong> — every member gets a QR-coded digital ID card</li>
          </ul>
          <h2 className="font-display text-2xl font-semibold text-ink">Get in touch</h2>
          <p>
            Class of 2005 alumni can <Link href="/login" className="text-brand underline">sign in</Link> to access the directory and members&rsquo; area. For partnerships, donations, or general enquiries, head to the <Link href="/contact" className="text-brand underline">contact page</Link>.
          </p>
        </div>
      </main>

      <footer className="bg-brand-deep py-10 text-on-dark/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm">
            <span className="font-semibold text-on-dark">KOSA</span> · Est. 1945
          </p>
          <Link href="/" className="text-[10px] uppercase tracking-[0.22em] hover:text-accent">← Home</Link>
        </div>
      </footer>
    </div>
  );
}
