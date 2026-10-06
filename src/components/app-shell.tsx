"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Compass,
  House,
  LogOut,
  MessageSquare,
  Plus,
  Radio,
  Settings,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import { useApp } from "./app-provider";

const navigation = [
  { href: "/home", label: "Home", icon: House },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/follow", label: "Discover", icon: Compass },
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    account,
    authenticated,
    loading,
    live,
    error,
    clearError,
    refreshData,
    createPost,
    logout,
  } = useApp();
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (!isAuthPage && !loading && !authenticated && !error) router.replace("/login");
  }, [authenticated, error, isAuthPage, loading, router]);

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content.trim().length < 4) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await createPost(content.trim());
      setContent("");
      setComposerOpen(false);
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "The post could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    try {
      await logout();
      router.replace("/login");
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "Sign out failed.");
    }
  }

  if (isAuthPage) return <>{children}</>;

  if (!authenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 text-center shadow-card">
          <h1 className="font-display text-2xl font-bold">
            {loading ? "Loading your space" : error ? "We couldn’t connect" : "Redirecting"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {loading ? "Checking your secure session…" : error ?? "Taking you to sign in…"}
          </p>
          {!loading && error && (
            <button
              onClick={() => {
                clearError();
                void refreshData();
              }}
              className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white px-5 py-7 lg:flex">
        <Link href="/home" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand text-white">
            <MessageSquare size={21} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">odinbook</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-2" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => setComposerOpen(true)}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
          >
            <Plus size={18} />
            Create a post
          </button>
        </nav>
        <div className="mt-6 rounded-2xl bg-surface p-3">
          <div className="flex items-center gap-3">
            <img
              src={account?.photo ?? "/default-avatar.svg"}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{account?.displayName ?? "Loading account"}</p>
              <p className="truncate text-xs text-muted">{account ? `@${account.username}` : " "}</p>
            </div>
            <button
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg p-2 text-muted hover:bg-white hover:text-ink"
            >
              <LogOut size={17} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
            <span className={`size-2 rounded-full ${live ? "bg-emerald-500" : "bg-slate-300"}`} />
            {live ? "Live updates connected" : "Reconnecting to live updates"}
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/home" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid size-8 place-items-center rounded-xl bg-brand text-white">
                <MessageSquare size={17} />
              </span>
              odinbook
            </Link>
            <span className="flex items-center gap-2 text-xs font-medium text-muted">
              <Radio size={14} className={live ? "text-emerald-500" : ""} />
              {live ? "Live" : "Connecting"}
            </span>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 pb-28 pt-7 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <span>{error}</span>
              <button onClick={clearError} aria-label="Dismiss error" className="shrink-0">
                <X size={17} />
              </button>
            </div>
          )}
          {actionError && (
            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {actionError}
            </div>
          )}
          {loading && !authenticated ? (
            <div className="grid min-h-[50vh] place-items-center">
              <p className="text-sm font-medium text-muted">Loading your space…</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden"
      >
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <Icon size={20} />
              {label === "My profile" ? "Profile" : label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setComposerOpen(true)}
        aria-label="Create a post"
        className="fixed bottom-20 right-5 z-20 grid size-14 place-items-center rounded-full bg-brand text-white shadow-xl shadow-brand/25 transition hover:scale-105 lg:hidden"
      >
        <Plus size={25} />
      </button>

      {composerOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setComposerOpen(false);
          }}
        >
          <form
            onSubmit={submitPost}
            className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">New post</p>
                <h2 className="mt-1 font-display text-2xl font-bold">Share something</h2>
              </div>
              <button type="button" onClick={() => setComposerOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <textarea
              autoFocus
              required
              minLength={4}
              maxLength={800}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What’s on your mind?"
              className="min-h-40 w-full resize-y rounded-2xl border border-line bg-canvas p-4 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted">{content.length}/800</span>
              <button
                disabled={submitting || content.trim().length < 4}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Publishing…" : "Publish post"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
