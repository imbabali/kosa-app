import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand py-6 text-on-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
            <span className="relative inline-block">
              KOSA
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent"
              />
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.22em] text-on-dark/70 transition hover:text-on-dark"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="rounded-2xl bg-surface p-8 ring-1 ring-ink/5 shadow-sm">
                <p className="text-sm text-ink-muted">Loading…</p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
