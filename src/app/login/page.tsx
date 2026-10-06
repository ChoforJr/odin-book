"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { useApp } from "../../components/app-provider";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { authenticated, loading, error: requestError, login, signup } = useApp();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && authenticated) router.replace("/home");
  }, [authenticated, loading, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        if (password !== confirmPassword) throw new Error("Your passwords do not match.");
        await signup(username, password, displayName);
      } else {
        await login(username, password);
      }
      router.replace("/home");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-[#22243b] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-24 -top-20 size-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-48 -left-24 size-[34rem] rounded-full border border-white/10" />
        <Link href="/" className="relative flex items-center gap-3 font-display text-xl font-bold">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand">
            <MessageSquare size={21} />
          </span>
          odinbook
        </Link>
        <div className="relative max-w-xl pb-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-100">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            A little more connected
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.12] tracking-tight xl:text-6xl">
            Good conversations start here.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-indigo-100/75">
            Share the moments, ideas and everyday things that bring your community together.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-indigo-100/80">
            <ShieldCheck size={18} />
            Your account is protected with secure, HttpOnly sessions.
          </div>
        </div>
        <p className="relative text-xs text-indigo-100/50">© 2026 Odinbook community</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-2 font-display text-lg font-bold lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
              <MessageSquare size={18} />
            </span>
            odinbook
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-brand">
            {mode === "login" ? "Welcome back" : "Join the conversation"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {mode === "login" ? "Sign in to Odinbook" : "Create your account"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {mode === "login"
              ? "Pick up where your community left off."
              : "A good place to keep up and share what matters."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Display name
                <input
                  required
                  minLength={4}
                  maxLength={64}
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </label>
            )}
            <label className="block text-sm font-semibold">
              Email address
              <input
                required
                type="email"
                minLength={8}
                maxLength={64}
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                required
                type="password"
                minLength={mode === "signup" ? 12 : 4}
                maxLength={mode === "signup" ? 128 : 64}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
              {mode === "signup" && (
                <span className="mt-1 block text-xs font-normal text-muted">Use at least 12 characters.</span>
              )}
            </label>
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Confirm password
                <input
                  required
                  type="password"
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </label>
            )}
            {(error ?? requestError) && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error ?? requestError}
              </p>
            )}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium text-muted">or try a demo account</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Goku", "goku@gmail.com"],
              ["Vegeta", "vegeta@gmail.com"],
            ].map(([name, email]) => (
              <button
                key={email}
                type="button"
                onClick={() => {
                  setMode("login");
                  setUsername(email);
                  setPassword("1234");
                }}
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-semibold hover:border-brand/40 hover:bg-brand/5"
              >
                Sign in as {name}
              </button>
            ))}
          </div>
          <p className="mt-7 text-center text-sm text-muted">
            {mode === "login" ? "New around here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode((current) => current === "login" ? "signup" : "login");
              }}
              className="font-bold text-brand hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
