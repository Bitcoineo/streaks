"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const EMOJI_OPTIONS = [
  "💪", "📖", "🧘", "🏃", "💧", "🎯", "✍️", "🎸",
  "🧹", "💤", "🥗", "🧠", "🚶", "📝", "🌅", "✅",
];

export default function AddHabitForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✅");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    setLoading(true);

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), emoji, frequency }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create habit");
      setLoading(false);
      return;
    }

    setName("");
    setEmoji("✅");
    setFrequency("daily");
    setOpen(false);
    setLoading(false);

    startTransition(() => {
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add habit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {error && (
        <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="habit-name" className="block text-sm font-medium mb-1">
          Habit name
        </label>
        <input
          id="habit-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Emoji</label>
        <div className="flex flex-wrap gap-1">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors ${
                emoji === e
                  ? "bg-zinc-200 dark:bg-zinc-700"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Frequency</label>
        <div className="flex gap-2">
          {(["daily", "weekly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                frequency === f
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
        >
          {loading ? "Creating..." : "Create habit"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
