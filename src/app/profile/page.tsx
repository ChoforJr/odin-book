"use client";

import { useState } from "react";
import { CalendarDays, UsersRound } from "lucide-react";
import { Feed } from "../../components/feed";
import { ProfileCard } from "../../components/profile-card";
import { useApp } from "../../components/app-provider";

type ProfileTab = "posts" | "liked" | "commented" | "followers" | "following";

const tabs: { id: ProfileTab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "liked", label: "Liked" },
  { id: "commented", label: "Commented" },
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
];

export default function ProfilePage() {
  const {
    account,
    myPosts,
    likedPosts,
    commentedPosts,
    followers,
    followings,
  } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  if (!account) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted">Your profile is not available.</p>;
  }

  const postGroups: Record<"posts" | "liked" | "commented", typeof myPosts> = {
    posts: myPosts,
    liked: likedPosts,
    commented: commentedPosts,
  };

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <div className="h-28 bg-gradient-to-r from-[#635bdb] via-[#9188ef] to-[#c8c3ff] sm:h-36" />
        <div className="px-5 pb-5 sm:px-8 sm:pb-7">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <img
              src={account.photo}
              alt=""
              className="size-24 rounded-3xl border-4 border-white bg-white object-cover shadow-sm sm:size-28"
            />
            <div className="flex gap-5 pb-1 text-right">
              <div>
                <p className="text-xl font-bold">{account.followingCount ?? followings.length}</p>
                <p className="text-xs text-muted">Following</p>
              </div>
              <div>
                <p className="text-xl font-bold">{account.followersCount ?? followers.length}</p>
                <p className="text-xs text-muted">Followers</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{account.displayName}</h1>
            <p className="mt-1 text-sm text-muted">@{account.username}</p>
            {account.bio && <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6">{account.bio}</p>}
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <CalendarDays size={15} />
              Joined {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </article>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white p-1.5">
        <div className="flex min-w-max gap-1" role="tablist" aria-label="Profile sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === tab.id ? "bg-brand text-white" : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "followers" || activeTab === "following" ? (
        (activeTab === "followers" ? followers : followings).length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {(activeTab === "followers" ? followers : followings).map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
            <UsersRound size={24} className="mx-auto text-muted" />
            <p className="mt-3 font-bold">No {activeTab} to show yet.</p>
          </div>
        )
      ) : (
        <Feed
          posts={postGroups[activeTab]}
          emptyTitle={`No ${tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} yet.`}
          emptyText="Posts and interactions from your account will appear here."
        />
      )}
    </section>
  );
}
