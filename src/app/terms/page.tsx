import Link from "next/link";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand py-6 text-on-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
            <span className="relative inline-block">KOSA<span aria-hidden className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent" /></span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-on-dark/70 hover:text-on-dark">← Back home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">Terms</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">Terms of service</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: 2026-05-06</p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink">
          <h2 className="font-display text-2xl font-semibold">Eligibility</h2>
          <p>
            This platform is for alumni of Kibuli Secondary School. Accounts are subject to verification by the KOSA committee.
          </p>

          <h2 className="font-display text-2xl font-semibold">Acceptable use</h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">Don&rsquo;t share contact information from the directory outside KOSA.</li>
            <li className="list-disc">No commercial solicitation of fellow members without their consent.</li>
            <li className="list-disc">No content that violates Ugandan law or the school&rsquo;s values.</li>
          </ul>

          <h2 className="font-display text-2xl font-semibold">Member content</h2>
          <p>
            You are responsible for the accuracy of the information you put on your profile. Don&rsquo;t impersonate other people. Photos you upload must be ones you have the right to use.
          </p>

          <h2 className="font-display text-2xl font-semibold">Termination</h2>
          <p>
            KOSA may suspend accounts that violate these terms. You can delete your account at any time from <Link href="/portal/more" className="text-brand underline">More → Delete my account</Link>.
          </p>

          <h2 className="font-display text-2xl font-semibold">Liability</h2>
          <p>
            The platform is provided as-is. KOSA is not liable for member-to-member interactions or for the loss of data due to unforeseen technical issues. We will however make reasonable efforts to maintain reliable backups.
          </p>

          <h2 className="font-display text-2xl font-semibold">Contact</h2>
          <p>
            Questions about these terms — <a className="text-brand underline" href="mailto:kosa.alumni@gmail.com">kosa.alumni@gmail.com</a>.
          </p>
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
