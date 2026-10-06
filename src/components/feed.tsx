import { PostCard } from "./post-card";
import type { Post } from "../types/models";

interface FeedProps {
  posts: Post[];
  emptyTitle: string;
  emptyText: string;
}

export function Feed({ posts, emptyTitle, emptyText }: FeedProps) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
        <p className="font-display text-xl font-bold">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
