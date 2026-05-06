"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FeedbackState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const message = String(formData.get("message") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim();

  if (!message) return { status: "error", message: "Please write a message." };
  if (message.length > 2000)
    return { status: "error", message: "Please keep feedback under 2000 characters." };

  const { error } = await supabase.from("feedback").insert({
    profile_id: user?.id ?? null,
    category,
    message,
  });

  if (error) return { status: "error", message: error.message };
  revalidatePath("/portal/feedback");
  return { status: "sent", message: "Thanks — your feedback was recorded." };
}
