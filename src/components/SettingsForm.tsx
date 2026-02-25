"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialName: string;
  email: string;
};

export default function SettingsForm({ initialName, email }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update");
      setLoading(false);
      return;
    }

    setMessage("Saved");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Display name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input
          type="email"
          disabled
          value={email}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-400">Email cannot be changed</p>
      </div>

      <button
        type="submit"
        disabled={loading || name.trim() === initialName}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
