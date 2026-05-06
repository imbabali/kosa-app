import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-brand py-4 text-on-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <Link
            href="/portal"
            className="font-display text-xl font-semibold tracking-tight"
          >
            <span className="relative inline-block">
              KOSA
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent"
              />
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Bottom nav placeholder — to be fleshed out in F3 (Member shell) */}
      <nav className="sticky bottom-0 border-t border-ink/5 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-6 py-3 text-xs uppercase tracking-[0.18em] text-ink-muted">
          <span aria-current="page" className="text-brand font-semibold">Home</span>
          <span className="opacity-40">Profile</span>
          <span className="opacity-40">Membership</span>
          <span className="opacity-40">Messages</span>
          <span className="opacity-40">More</span>
        </div>
      </nav>
    </div>
  );
}
