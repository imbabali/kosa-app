import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";
import { BottomNav } from "@/components/nav/bottom-nav";

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

      <main className="flex-1 pb-4">{children}</main>

      <BottomNav />
    </div>
  );
}
