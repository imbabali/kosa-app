import Link from "next/link";
import { PageShell, EmptyState } from "@/components/ui/page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Directory" };

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();

  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      "id, full_name, display_name, email, phone, residence, workplace, focus, avatar_url, member_id, legacy_address, legacy_business_details",
    )
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (q) {
    // Escape special chars then OR-search across the searchable columns.
    const safe = q.replace(/[%_,]/g, "");
    query = query.or(
      [
        `full_name.ilike.%${safe}%`,
        `email.ilike.%${safe}%`,
        `phone.ilike.%${safe}%`,
        `workplace.ilike.%${safe}%`,
        `focus.ilike.%${safe}%`,
        `residence.ilike.%${safe}%`,
        `legacy_address.ilike.%${safe}%`,
        `legacy_business_details.ilike.%${safe}%`,
      ].join(","),
    );
  }

  const { data: members, error } = await query;

  return (
    <PageShell
      title="Directory"
      subtitle={`${members?.length ?? 0} alumni · search by name, workplace, location, focus.`}
    >
      <form className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search the directory…"
          className="w-full rounded-full border border-ink/10 bg-surface px-5 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error.message}
        </p>
      )}

      {!members || members.length === 0 ? (
        <EmptyState
          title={q ? "No matches" : "No members yet"}
          body={q ? `Nothing matches "${q}". Try a different search term.` : "The directory will populate as alumni sign in."}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => {
            const work = m.workplace ?? m.legacy_business_details ?? "";
            const where = m.residence ?? m.legacy_address ?? "";
            const initial = (m.full_name ?? m.email)[0]?.toUpperCase() ?? "?";
            return (
              <li key={m.id}>
                <Link
                  href={`/portal/directory/${m.id}`}
                  className="flex h-full items-start gap-4 rounded-2xl bg-surface p-5 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md hover:ring-brand/20"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-muted ring-2 ring-brand/15">
                    {m.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-base font-semibold text-brand">
                        {initial}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {m.full_name ?? m.email}
                    </p>
                    {work && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{work}</p>
                    )}
                    {where && (
                      <p className="line-clamp-1 text-xs text-ink-muted/70">📍 {where}</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
