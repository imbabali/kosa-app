"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const FORM_PATH = "/portal/admin/events/new";
const errBack = (msg: string) =>
  redirect(`${FORM_PATH}?error=${encodeURIComponent(msg)}`);

export async function createEvent(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) errBack("Not signed in.");

  const get = (k: string) => {
    const v = formData.get(k);
    return v == null ? null : String(v).trim() || null;
  };

  const startsRaw = get("starts_at");
  if (!startsRaw) errBack("Start time is required.");
  const title = get("title");
  if (!title) errBack("Title is required.");

  const endsRaw = get("ends_at");
  const capacityRaw = get("capacity");

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: title!,
      description: get("description"),
      venue: get("venue"),
      city: get("city"),
      starts_at: new Date(startsRaw!).toISOString(),
      ends_at: endsRaw ? new Date(endsRaw).toISOString() : null,
      capacity: capacityRaw ? parseInt(capacityRaw, 10) : null,
      is_published: get("is_published") === "on",
      created_by: user!.id,
    })
    .select("id")
    .single();

  if (error) errBack(error.message);
  revalidatePath("/portal/events");
  revalidatePath("/portal");
  redirect(`/portal/events/${data!.id}`);
}
