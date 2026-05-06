import Link from "next/link";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
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
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand">Privacy</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">Privacy policy</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: 2026-05-06</p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink">
          <h2 className="font-display text-2xl font-semibold">Who we are</h2>
          <p>
            KOSA — the Kibuli SS Old Students Association — runs this platform exclusively for verified alumni of Kibuli Secondary School. Personal data described here is held to facilitate alumni connection and event coordination, not for commercial use.
          </p>

          <h2 className="font-display text-2xl font-semibold">What we store</h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">Account: email address, sign-in timestamps, session cookies.</li>
            <li className="list-disc">Profile (self-reported): name, phone, residence, workplace, professional focus, photo.</li>
            <li className="list-disc">Activity: event RSVPs, notice read-status, feedback you submit.</li>
            <li className="list-disc">Legacy archive: where applicable, the original 2022 alumni Google Form submission you authorised.</li>
          </ul>

          <h2 className="font-display text-2xl font-semibold">Who can see your data</h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">Other authenticated KOSA members can see your profile in the member directory.</li>
            <li className="list-disc">KOSA admins can see all profiles, RSVPs, and feedback.</li>
            <li className="list-disc">No data is shared with third parties for advertising. No data is sold.</li>
            <li className="list-disc">Hosting: <strong>Vercel</strong> (web app) and <strong>Supabase</strong> (database, file storage, auth) — both bound by their respective DPAs.</li>
          </ul>

          <h2 className="font-display text-2xl font-semibold">Your rights</h2>
          <p>
            You can edit your profile at any time from <Link href="/portal/profile" className="text-brand underline">My Profile</Link>. You can delete your account permanently from the More menu — this removes your profile, RSVPs, and feedback.
          </p>

          <h2 className="font-display text-2xl font-semibold">Cookies</h2>
          <p>
            We use first-party authentication cookies only, set by Supabase to keep you signed in. No analytics or marketing cookies.
          </p>

          <h2 className="font-display text-2xl font-semibold">Contact</h2>
          <p>
            Questions? Reach the team at <a className="text-brand underline" href="mailto:kosa.alumni@gmail.com">kosa.alumni@gmail.com</a> or via <Link href="/portal/feedback" className="text-brand underline">in-app feedback</Link>.
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
