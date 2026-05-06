"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { key: "home", label: "Home", href: "/portal", match: (p: string) => p === "/portal" },
  { key: "profile", label: "Profile", href: "/portal/profile", match: (p: string) => p.startsWith("/portal/profile") },
  { key: "membership", label: "Membership", href: "/portal/id-card", match: (p: string) => p.startsWith("/portal/id-card") },
  { key: "directory", label: "Directory", href: "/portal/directory", match: (p: string) => p.startsWith("/portal/directory") },
  { key: "more", label: "More", href: "/portal/more", match: (p: string) => p.startsWith("/portal/more") || p.startsWith("/portal/events") || p.startsWith("/portal/notices") || p.startsWith("/portal/feedback") },
];

export function BottomNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      aria-label="Member portal"
      className="sticky bottom-0 z-10 border-t border-ink/5 bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-around px-3 py-2 sm:py-3">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
                active
                  ? "text-brand"
                  : "text-ink-muted/70 hover:text-ink"
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`h-0.5 w-6 rounded-full transition ${
                  active ? "bg-accent" : "bg-transparent"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
