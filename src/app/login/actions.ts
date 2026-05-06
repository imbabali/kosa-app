"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "sent" | "error";
  email?: string;
  error?: string;
};

export async function signInWithEmail(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const raw = String(formData.get("email") ?? "");
  const email = raw.trim().toLowerCase();
  const next = String(formData.get("next") ?? "/portal");

  if (!email || !email.includes("@")) {
    return { status: "error", error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get("host") ?? "kosa-app.vercel.app";
  const protocol = host.includes("localhost") || host.startsWith("127.")
    ? "http"
    : "https";

  const safeNext = next.startsWith("/") ? next : "/portal";
  const redirectTo = `${protocol}://${host}/auth/callback?next=${encodeURIComponent(safeNext)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) return { status: "error", error: error.message };
  return { status: "sent", email };
}
