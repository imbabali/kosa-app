import { PageShell } from "@/components/ui/page-shell";
import { getCurrentProfile } from "@/lib/queries/profile";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  // Compute completeness
  const fields = [
    profile.full_name,
    profile.phone,
    profile.residence,
    profile.workplace,
    profile.focus,
    profile.avatar_url,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <PageShell title="My Profile" subtitle="Edit how classmates see you in the directory.">
      <div className="mb-6 rounded-2xl bg-surface p-5 ring-1 ring-ink/5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-ink">Profile completeness</p>
          <p className="text-sm font-bold text-brand">{pct}%</p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ProfileForm profile={profile} />
    </PageShell>
  );
}
