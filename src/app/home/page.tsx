"use client";

import { useApp } from "../../components/app-provider";
import { Feed } from "../../components/feed";

export default function HomePage() {
  const { homePosts, account } = useApp();
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">Your community</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Good to see you, {account?.displayName.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-sm text-muted">Catch up on what your people have shared.</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-card">
          {homePosts.length} recent {homePosts.length === 1 ? "post" : "posts"}
        </span>
      </header>
      <Feed
        posts={homePosts}
        emptyTitle="Your feed is ready for a first hello."
        emptyText="Follow a few people or create a post to get the conversation started."
      />
    </section>
  );
}
