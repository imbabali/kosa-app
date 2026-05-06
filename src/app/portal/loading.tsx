export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-3xl bg-brand/10 p-8 sm:p-12">
        <div className="h-3 w-32 animate-pulse rounded-full bg-brand/20" />
        <div className="mt-4 h-9 w-3/4 animate-pulse rounded-full bg-brand/15" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-brand/10" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface ring-1 ring-ink/5" />
        ))}
      </div>
    </div>
  );
}
