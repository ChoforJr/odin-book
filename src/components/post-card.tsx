"use client";

import Link from "next/link";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "./app-provider";
import type { Post } from "../types/models";

interface PostCardProps {
  post: Post;
}

function timeAgo(date: string): string {
  const elapsed = Date.now() - new Date(date).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "just now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`;
  return new Date(date).toLocaleDateString();
}

export function PostCard({ post }: PostCardProps) {
  const { account, togglePostLike, deletePost } = useApp();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const isMine = account?.id === post.profileId;

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:shadow-card-hover sm:p-5">
      <div className="flex items-start gap-3">
        <img
          src={post.profilePhoto}
          alt=""
          className="size-11 shrink-0 rounded-full bg-surface object-cover"
        />
        <div className="min-w-0 flex-1">
          <Link href={`/post/${post.id}`} className="group block">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="font-bold text-ink group-hover:text-brand">
                {post.profileDisplayName}
              </h2>
              {post.profileType === "guest" && (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                  DEMO
                </span>
              )}
              <time dateTime={post.createdAt} className="text-xs text-muted">
                · {timeAgo(post.createdAt)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/90">
              {post.content}
            </p>
          </Link>
          <div className="mt-4 flex items-center gap-5 border-t border-line pt-3">
            <button
              onClick={() => void runAction(() => togglePostLike(post.id))}
              disabled={busy}
              aria-label={`Like post, ${post.likeCount} likes`}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            >
              <Heart size={17} />
              {post.likeCount}
            </button>
            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-brand/5 hover:text-brand"
            >
              <MessageCircle size={17} />
              {post.commentCount}
            </Link>
            {isMine && (
              <button
                onClick={() => void runAction(() => deletePost(post.id))}
                disabled={busy}
                aria-label="Delete post"
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
          {actionError && <p role="alert" className="mt-2 text-xs text-red-700">{actionError}</p>}
        </div>
      </div>
    </article>
  );
}
