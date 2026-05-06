export function formatEventDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatEventTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventDateChip(iso: string | null | undefined) {
  if (!iso) return { day: "—", month: "—" };
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
  };
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Generate a member ID like "KOSA20250001" from a sequence + year.
 * If no sequence, derives from the user UUID for consistent uniqueness.
 */
export function deriveMemberId(uuid: string, year = 2025): string {
  // Take last 4 hex digits of UUID, convert to base-10 0-padded 4-digit
  const tail = uuid.replace(/-/g, "").slice(-6);
  const num = parseInt(tail, 16) % 10000;
  return `KOSA${year}${String(num).padStart(4, "0")}`;
}

export function membershipStatus(
  ends_at: string | null | undefined,
  is_active: boolean | null | undefined,
): "active" | "expired" | "inactive" {
  if (is_active === false) return "inactive";
  if (!ends_at) return "active";
  return new Date(ends_at) >= new Date() ? "active" : "expired";
}
