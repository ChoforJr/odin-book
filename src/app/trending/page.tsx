"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { Feed } from "../../components/feed";
import { useApp } from "../../components/app-provider";

export default function TrendingPage() {
  const { trendingPosts } = useApp();
  return (
    <section className="space-y-6">
      <header>
        <p className="flex items-center gap-2 text-sm font-semibold text-brand">
          <Sparkles size={16} /> Happening across Odinbook
        </p>
        <h1 className="mt-1 flex items-center gap-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Trending <TrendingUp className="text-brand" size={28} />
        </h1>
        <p className="mt-2 text-sm text-muted">Posts people are talking about right now.</p>
      </header>
      <Feed
        posts={trendingPosts}
        emptyTitle="Nothing trending just yet."
        emptyText="When the community starts sharing, popular posts will show up here."
      />
    </section>
  );
}
