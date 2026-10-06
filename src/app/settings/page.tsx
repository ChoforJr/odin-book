"use client";

import { useRef, useState, type FormEvent } from "react";
import { Camera, LogOut, Shield, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "../../components/app-provider";

export default function SettingsPage() {
  const router = useRouter();
  const {
    account,
    authenticated,
    updateProfile,
    changePassword,
    uploadPhoto,
    deleteAccount,
    logout,
  } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isGuest = account?.type === "guest";

  async function handleAction(action: () => Promise<void>, success: string) {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      await action();
      setMessage(success);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function update(
    event: FormEvent<HTMLFormElement>,
    field: "displayName" | "bio" | "userName",
    value: string,
  ) {
    event.preventDefault();
    await handleAction(() => updateProfile(field, value), "Your profile has been updated.");
    if (field === "displayName") setDisplayName("");
    if (field === "bio") setBio("");
    if (field === "userName") setUsername("");
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleAction(async () => {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, "Your password has been changed.");
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    await handleAction(() => uploadPhoto(file), "Your profile photo has been updated.");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete() {
    if (!window.confirm("This permanently deletes your account and its posts. Continue?")) return;
    await handleAction(async () => {
      await deleteAccount();
      router.replace("/login");
    }, "Account deleted.");
  }

  async function handleLogout() {
    await handleAction(async () => {
      await logout();
      router.replace("/login");
    }, "You have signed out.");
  }

  if (!authenticated || !account) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted">Sign in to manage your account.</p>;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-brand">Account preferences</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted">Keep your profile and sign-in details up to date.</p>
      </header>

      {isGuest && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You’re using a demo profile. Profile edits and account deletion are disabled.
        </div>
      )}
      {message && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <img src={account.photo} alt="" className="size-16 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="font-bold">{account.displayName}</h2>
            <p className="mt-1 text-sm text-muted">@{account.username}</p>
          </div>
          {!isGuest && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => void handlePhoto(event.target.files?.[0])}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-bold hover:border-brand/40 hover:text-brand disabled:opacity-50"
              >
                <Camera size={16} /> Change photo
              </button>
            </>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">PNG or JPEG · maximum 1 MB</p>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="flex items-center gap-2 font-bold"><UserRound size={18} className="text-brand" /> Profile information</h2>
        <div className="mt-5 space-y-5">
          <form onSubmit={(event) => void update(event, "displayName", displayName)} className="flex flex-col gap-2 sm:flex-row">
            <label className="flex-1 text-xs font-semibold text-muted">
              Display name
              <input
                required
                minLength={4}
                maxLength={64}
                disabled={isGuest || busy}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={account.displayName}
                className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
              />
            </label>
            <button disabled={isGuest || busy || !displayName.trim()} className="self-end rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">Save</button>
          </form>
          <form onSubmit={(event) => void update(event, "bio", bio)} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex-1 text-xs font-semibold text-muted">
              Bio
              <textarea
                required
                minLength={4}
                maxLength={250}
                disabled={isGuest || busy}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder={account.bio || "Write a few words about yourself…"}
                className="mt-1.5 min-h-24 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
              />
            </label>
            <button disabled={isGuest || busy || !bio.trim()} className="rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">Save bio</button>
          </form>
          <form onSubmit={(event) => void update(event, "userName", username)} className="flex flex-col gap-2 sm:flex-row">
            <label className="flex-1 text-xs font-semibold text-muted">
              Email address
              <input
                required
                type="email"
                minLength={8}
                maxLength={64}
                disabled={isGuest || busy}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={account.username}
                className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
              />
            </label>
            <button disabled={isGuest || busy || !username.trim()} className="self-end rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">Update email</button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="flex items-center gap-2 font-bold"><Shield size={18} className="text-brand" /> Change password</h2>
        <form onSubmit={(event) => void updatePassword(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-muted sm:col-span-2">
            Current password
            <input
              required
              type="password"
              autoComplete="current-password"
              disabled={isGuest || busy}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
            />
          </label>
          <label className="text-xs font-semibold text-muted">
            New password
            <input
              required
              minLength={12}
              maxLength={128}
              type="password"
              autoComplete="new-password"
              disabled={isGuest || busy}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
            />
          </label>
          <label className="text-xs font-semibold text-muted">
            Confirm new password
            <input
              required
              minLength={12}
              maxLength={128}
              type="password"
              autoComplete="new-password"
              disabled={isGuest || busy}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:bg-surface"
            />
          </label>
          <button disabled={isGuest || busy || !newPassword || newPassword !== confirmPassword} className="rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
            Update password
          </button>
        </form>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <button
          onClick={() => void handleLogout()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold hover:bg-surface disabled:opacity-50"
        >
          <LogOut size={17} /> Sign out
        </button>
        <button
          onClick={() => void handleDelete()}
          disabled={isGuest || busy}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={17} /> Delete account
        </button>
      </section>
    </section>
  );
}
