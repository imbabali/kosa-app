"use client";

import { useActionState, useRef, useState } from "react";
import { updateProfile, uploadAvatar, type ProfileFormState } from "./actions";
import type { Profile } from "@/lib/queries/profile";

const initial: ProfileFormState = { status: "idle" };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [avatarPending, setAvatarPending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPending(true);
    const fd = new FormData();
    fd.set("avatar", file);
    const res = await uploadAvatar(fd);
    setAvatarPending(false);
    if (res.ok && res.url) setAvatarUrl(res.url);
    else alert(res.error ?? "Upload failed");
  }

  return (
    <form action={action} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-surface-muted ring-2 ring-brand/20">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-2xl text-ink-muted">
                {(profile.full_name ?? profile.email)[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarPending}
            className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition hover:bg-surface disabled:opacity-50"
          >
            {avatarPending ? "Uploading…" : avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          <p className="mt-1 text-xs text-ink-muted">JPG/PNG, up to 5MB.</p>
        </div>
      </div>

      <Field name="full_name" label="Full name" defaultValue={profile.full_name ?? ""} required />
      <Field name="display_name" label="Display name" placeholder="What people call you" defaultValue={profile.display_name ?? ""} />
      <Field name="phone" label="Phone" type="tel" defaultValue={profile.phone ?? ""} />
      <Field name="residence" label="Residence" placeholder="City / area" defaultValue={profile.residence ?? ""} />
      <Field name="workplace" label="Place of work" defaultValue={profile.workplace ?? ""} />
      <Field name="focus" label="Professional focus" placeholder="e.g. Civil engineering, Pediatrics" defaultValue={profile.focus ?? ""} />
      <FieldArea name="details" label="Additional details" placeholder="Anything else classmates should know" defaultValue={profile.details ?? ""} />

      {state.status === "saved" && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-on-dark transition hover:bg-brand-deep disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function FieldArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <textarea
        rows={3}
        {...rest}
        className="mt-2 w-full rounded-lg border border-ink/10 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
