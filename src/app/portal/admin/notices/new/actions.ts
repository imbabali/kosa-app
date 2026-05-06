"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const FORM_PATH = "/portal/admin/notices/new";
const errBack = (msg: string) =>
  redirect(`${FORM_PATH}?error=${encodeURIComponent(msg)}`);

export async function createNotice(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) errBack("Not signed in.");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = formData.get("pinned") === "on";

  if (!title || !body) errBack("Title and body required.");

  const { data, error } = await supabase
    .from("notices")
    .insert({
      title,
      body,
      pinned,
      is_published: true,
      created_by: user!.id,
    })
    .select("id")
    .single();

  if (error) errBack(error.message);
  revalidatePath("/portal/notices");
  revalidatePath("/portal");
  redirect(`/portal/notices/${data!.id}`);
}
