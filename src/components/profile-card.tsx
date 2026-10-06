"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { useApp } from "./app-provider";
import type { Profile } from "../types/models";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { followings, followProfile, onlineUserIds } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const following = followings.some((item) => item.id === profile.id);

  async function toggleFollow() {
    setBusy(true);
    setError(null);
    try {
      await followProfile(profile.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update follow.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <div className="relative shrink-0">
        <img src={profile.photo} alt="" className="size-14 rounded-full bg-surface object-cover" />
        <span
          aria-label={onlineUserIds.has(profile.userId) ? "Online" : "Offline"}
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
            onlineUserIds.has(profile.userId) ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-bold">{profile.displayName}</h2>
        {profile.bio && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{profile.bio}</p>}
        {error && <p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
      <button
        onClick={() => void toggleFollow()}
        disabled={busy}
        className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
          following
            ? "border border-line bg-white text-ink hover:border-red-200 hover:text-red-600"
            : "bg-brand text-white hover:bg-brand-dark"
        }`}
      >
        {following ? <Check size={15} /> : <UserPlus size={15} />}
        <span className="hidden sm:inline">{following ? "Following" : "Follow"}</span>
      </button>
    </article>
  );
}
