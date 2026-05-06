import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand p-8 text-center text-on-dark">
      <p className="font-display text-7xl font-semibold tracking-tight">
        <span className="relative inline-block">
          404
          <span aria-hidden className="absolute -bottom-1 left-1 right-1 h-1 rounded-full bg-accent" />
        </span>
      </p>
      <p className="mt-6 font-display text-2xl italic text-on-dark/85">Page not found</p>
      <p className="mt-3 max-w-sm text-sm text-on-dark/60">
        We couldn&rsquo;t find what you were looking for. It may have moved, or never existed.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-brand-deep transition hover:bg-accent/90"
        >
          Go home
        </Link>
        <Link
          href="/portal"
          className="inline-flex h-11 items-center justify-center rounded-full border border-on-dark/30 px-6 text-sm font-medium text-on-dark/85 transition hover:bg-on-dark/5"
        >
          Member portal
        </Link>
      </div>
    </div>
  );
}
