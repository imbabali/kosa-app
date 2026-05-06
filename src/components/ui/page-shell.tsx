import Link from "next/link";

export function PageShell({
  title,
  subtitle,
  back = "/portal",
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          {back && (
            <Link
              href={back}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-ink-muted transition hover:text-brand"
            >
              ← Back
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-surface-muted p-10 text-center">
      <p className="font-display text-xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{body}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
