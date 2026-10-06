"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Heart, Send, Trash2 } from "lucide-react";
import { useApp } from "../../../components/app-provider";
import { apiRequest } from "../../../lib/api";
import { normalizePost } from "../../../lib/normalize";
import type { Post, PostResponse, Comment } from "../../../types/models";

export default function PostPage() {
  const params = useParams<{ postID: string }>();
  const postId = Number(params.postID);
  const {
    account,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    commentRevision,
    getComments,
    createComment,
    toggleCommentLike,
    deleteComment,
    togglePostLike,
    deletePost,
  } = useApp();
  const posts = useMemo(
    () => [...homePosts, ...trendingPosts, ...myPosts, ...likedPosts, ...commentedPosts],
    [homePosts, trendingPosts, myPosts, likedPosts, commentedPosts],
  );
  const [fetchedPost, setFetchedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const post = posts.find((item) => item.id === postId) ?? fetchedPost;

  useEffect(() => {
    if (!Number.isSafeInteger(postId) || postId < 1) {
      setError("This post address is invalid.");
      setLoading(false);
      return;
    }
    if (posts.some((item) => item.id === postId)) return;
    let active = true;
    setLoading(true);
    void apiRequest<PostResponse>(`/post/${postId}`)
      .then((result) => {
        if (active) setFetchedPost(normalizePost(result));
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Post could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId, posts]);

  const loadComments = useCallback(async () => {
    if (!Number.isSafeInteger(postId) || postId < 1) return;
    try {
      setComments(await getComments(postId));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Comments could not be loaded.");
    }
  }, [getComments, postId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments, commentRevision]);

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createComment(postId, content.trim());
      setContent("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Comment could not be published.");
    } finally {
      setBusy(false);
    }
  }

  async function runAction(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Action failed.");
    }
  }

  if (loading && !post) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted">Loading post…</p>;
  }
  if (!post) {
    return (
      <section className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="font-display text-xl font-bold">This post isn’t available.</p>
        {error && <p className="mt-2 text-sm text-muted">{error}</p>}
        <Link href="/home" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">
          <ArrowLeft size={16} /> Back to your feed
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <Link href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft size={16} /> Back to feed
      </Link>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <article className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
        <div className="flex items-center gap-3">
          <img src={post.profilePhoto} alt="" className="size-12 rounded-full bg-surface object-cover" />
          <div>
            <h1 className="font-bold">{post.profileDisplayName}</h1>
            <time dateTime={post.createdAt} className="text-xs text-muted">
              {new Date(post.createdAt).toLocaleString()}
            </time>
          </div>
        </div>
        <p className="mt-6 whitespace-pre-wrap break-words text-base leading-7">{post.content}</p>
        <div className="mt-6 flex items-center gap-4 border-t border-line pt-4">
          <button
            onClick={() => void runAction(() => togglePostLike(post.id))}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-rose-600"
          >
            <Heart size={18} /> {post.likeCount} likes
          </button>
          <span className="text-sm text-muted">{post.commentCount} comments</span>
          {account?.id === post.profileId && (
            <button
              onClick={() => void runAction(() => deletePost(post.id))}
              className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
            >
              <Trash2 size={17} /> Delete post
            </button>
          )}
        </div>
      </article>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
        <div>
          <h2 className="font-display text-xl font-bold">Conversation</h2>
          <p className="mt-1 text-sm text-muted">Share a thoughtful reply.</p>
        </div>
        <form onSubmit={handleComment} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="new-comment">Write a comment</label>
          <textarea
            id="new-comment"
            required
            minLength={4}
            maxLength={800}
            rows={2}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Add to the conversation…"
            className="min-h-12 flex-1 resize-y rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          <button
            disabled={busy || content.trim().length < 4}
            aria-label="Send comment"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white hover:bg-brand-dark disabled:opacity-50"
          >
            <Send size={17} />
          </button>
        </form>

        {comments.length ? (
          <div className="divide-y divide-line">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                own={account?.id === comment.profileId}
                onLike={() => runAction(() => toggleCommentLike(comment.id))}
                onDelete={() => runAction(() => deleteComment(comment.id))}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-canvas px-4 py-6 text-center text-sm text-muted">
            No replies so far. Start the conversation.
          </p>
        )}
      </section>
    </section>
  );
}

interface CommentItemProps {
  comment: Comment;
  own: boolean;
  onLike: () => Promise<void>;
  onDelete: () => Promise<void>;
}

function CommentItem({ comment, own, onLike, onDelete }: CommentItemProps) {
  const [busy, setBusy] = useState(false);
  async function invoke(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="flex gap-3 py-4 first:pt-1 last:pb-1">
      <img src={comment.profilePhoto} alt="" className="size-9 shrink-0 rounded-full bg-surface object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">{comment.profileDisplayName}</h3>
          <time className="text-[11px] text-muted">{new Date(comment.createdAt).toLocaleDateString()}</time>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{comment.content}</p>
        <div className="mt-2 flex gap-3">
          <button disabled={busy} onClick={() => void invoke(onLike)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-rose-600">
            <Heart size={14} /> {comment.likeCount}
          </button>
          {own && (
            <button disabled={busy} onClick={() => void invoke(onDelete)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red-600">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
