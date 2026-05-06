"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type RsvpStatus = Database["public"]["Enums"]["rsvp_status"];

export async function setRsvp(eventId: string, status: RsvpStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("event_rsvps").upsert(
    { event_id: eventId, profile_id: user.id, status },
    { onConflict: "event_id,profile_id" },
  );

  if (error) return { error: error.message };

  revalidatePath(`/portal/events/${eventId}`);
  revalidatePath("/portal/events");
  revalidatePath("/portal");
  return { ok: true };
}

export async function clearRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("event_rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("profile_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/portal/events/${eventId}`);
  revalidatePath("/portal/events");
  return { ok: true };
}
