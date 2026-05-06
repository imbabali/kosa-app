import QRCode from "qrcode";
import { PageShell } from "@/components/ui/page-shell";
import { getCurrentProfile } from "@/lib/queries/profile";
import { deriveMemberId, membershipStatus } from "@/lib/utils/format";

export const metadata = { title: "Digital ID" };

export default async function IdCardPage() {
  const profile = await getCurrentProfile();

  const memberId = profile.member_id ?? deriveMemberId(profile.id, profile.year_joined ?? 2025);
  const status = membershipStatus(profile.membership_ends_at, profile.is_active);
  const validFrom = profile.membership_starts_at?.slice(0, 4) ?? "2025";
  const validTo = profile.membership_ends_at?.slice(0, 4) ?? String(parseInt(validFrom) + 1);

  // Generate QR code SVG with member identity payload
  const qrPayload = JSON.stringify({
    v: 1,
    type: "kosa-member",
    id: memberId,
    name: profile.full_name ?? profile.email,
    issuer: "kosa-app.vercel.app",
  });
  const qrSvg = await QRCode.toString(qrPayload, {
    type: "svg",
    margin: 1,
    width: 240,
    color: { dark: "#1F4E2D", light: "#FFFFFF" },
  });

  return (
    <PageShell title="Digital ID" subtitle="Carry your KOSA membership in your pocket. Scannable at events.">
      <div className="mx-auto max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-brand-deep text-on-dark shadow-2xl ring-4 ring-accent/30">
          <div className="bg-brand p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
                {status === "active" ? "Active member" : status === "expired" ? "Expired" : "Inactive"}
              </p>
              <p className="font-display text-lg font-semibold tracking-tight">
                <span className="relative inline-block">
                  KOSA
                  <span aria-hidden className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-accent" />
                </span>
              </p>
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold leading-tight">
              {profile.full_name ?? profile.email.split("@")[0]}
            </h2>
            {profile.workplace && (
              <p className="mt-1 text-sm text-on-dark/80">{profile.workplace}</p>
            )}
            {profile.residence && (
              <p className="text-xs text-on-dark/65">{profile.residence}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-dark/60">
                Member ID
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-wider">
                {memberId}
              </p>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-dark/60">
                Valid
              </p>
              <p className="mt-1 font-display text-base font-semibold text-accent">
                {validFrom} – {validTo}
              </p>
            </div>
            <div
              className="rounded-lg bg-white p-2"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Show this card at KOSA events. Scan the QR for verification.
        </p>
      </div>
    </PageShell>
  );
}
