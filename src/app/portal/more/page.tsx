import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { isAdmin } from "@/lib/queries/profile";

export const metadata = { title: "More" };

export default async function MorePage() {
  const admin = await isAdmin();

  return (
    <PageShell title="More" subtitle="Settings, links, and other actions.">
      <div className="space-y-3">
        <MoreLink href="/portal/profile" icon="👤">My profile</MoreLink>
        <MoreLink href="/portal/id-card" icon="🪪">Digital ID</MoreLink>
        <MoreLink href="/portal/events" icon="📅">Events</MoreLink>
        <MoreLink href="/portal/notices" icon="📢">Notices</MoreLink>
        <MoreLink href="/portal/feedback" icon="💬">Send feedback</MoreLink>
        {admin && (
          <MoreLink href="/portal/admin" icon="🛡️">Admin dashboard</MoreLink>
        )}
        <div className="pt-4">
          <p className="px-2 text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
            About
          </p>
        </div>
        <MoreLink href="/about" icon="ℹ️">About KOSA</MoreLink>
        <MoreLink href="/privacy" icon="🔒">Privacy</MoreLink>
        <MoreLink href="/terms" icon="📜">Terms</MoreLink>
        <MoreLink href="/contact" icon="✉️">Contact</MoreLink>
        <div className="pt-4">
          <p className="px-2 text-xs font-medium uppercase tracking-[0.22em] text-danger">
            Danger zone
          </p>
        </div>
        <MoreLink href="/portal/settings/delete-account" icon="🗑️" tone="danger">
          Delete my account
        </MoreLink>
      </div>
    </PageShell>
  );
}

function MoreLink({
  href,
  icon,
  children,
  tone,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  tone?: "danger";
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-ink/5 shadow-sm transition hover:shadow-md ${
        tone === "danger" ? "hover:ring-danger/30" : "hover:ring-brand/20"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className={`flex-1 text-sm font-semibold ${tone === "danger" ? "text-danger" : "text-ink"}`}>
        {children}
      </span>
      <span className="text-ink-muted">→</span>
    </Link>
  );
}
