"use client";

import { Compass, UsersRound } from "lucide-react";
import { ProfileCard } from "../../components/profile-card";
import { useApp } from "../../components/app-provider";

export default function DiscoverPage() {
  const { exploreProfiles, followings } = useApp();
  return (
    <section className="space-y-6">
      <header>
        <p className="flex items-center gap-2 text-sm font-semibold text-brand">
          <Compass size={16} /> Find your people
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Discover</h1>
        <p className="mt-2 text-sm text-muted">Explore profiles and build your circle.</p>
      </header>
      <div className="flex items-center gap-2 text-xs font-semibold text-muted">
        <UsersRound size={15} />
        {followings.length} {followings.length === 1 ? "person" : "people"} in your circle
      </div>
      {exploreProfiles.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {exploreProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <p className="font-display text-xl font-bold">You’ve found everyone for now.</p>
          <p className="mt-2 text-sm text-muted">Check back later to discover new profiles.</p>
        </div>
      )}
    </section>
  );
}
