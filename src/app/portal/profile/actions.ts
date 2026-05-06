"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
};

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not signed in." };

  const get = (k: string) => {
    const v = formData.get(k);
    return v == null ? null : String(v).trim() || null;
  };

  const update = {
    full_name: get("full_name"),
    display_name: get("display_name"),
    phone: get("phone"),
    residence: get("residence"),
    workplace: get("workplace"),
    focus: get("focus"),
    details: get("details"),
  };

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/portal/profile");
  revalidatePath("/portal");
  revalidatePath("/portal/directory");
  return { status: "saved", message: "Profile updated." };
}

export async function uploadAvatar(formData: FormData): Promise<{ ok: boolean; error?: string; url?: string }> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "No file" };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Max 5MB" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${data.publicUrl}?v=${Date.now()}`;

  await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  revalidatePath("/portal/profile");
  return { ok: true, url };
}
