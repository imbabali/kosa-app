"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const FORM_PATH = "/portal/settings/delete-account";
const errBack = (msg: string) =>
  redirect(`${FORM_PATH}?error=${encodeURIComponent(msg)}`);

export async function deleteMyAccount(formData: FormData): Promise<void> {
  const confirm = String(formData.get("confirm") ?? "");
  if (confirm !== "DELETE") errBack("Type DELETE to confirm.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) errBack("Not signed in.");

  const admin = createServiceRoleClient();
  const { error } = await admin.auth.admin.deleteUser(user!.id);
  if (error) errBack(error.message);

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
