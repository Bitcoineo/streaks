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
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 px-4 py-3.5 text-sm font-medium text-stone-500 hover:border-amber-400 hover:text-amber-600 dark:border-stone-700 dark:text-stone-400 dark:hover:border-amber-600 dark:hover:text-amber-400 transition-colors"
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
      className="card p-5"
    >
      {error && (
        <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="habit-name" className="block text-sm font-medium mb-1.5">
          Habit name
        </label>
        <input
          id="habit-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:focus:border-amber-500"
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1.5">Emoji</label>
        <div className="flex flex-wrap gap-1">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors ${
                emoji === e
                  ? "bg-amber-100 ring-2 ring-amber-500/30 dark:bg-amber-950/50"
                  : "hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5">Frequency</label>
        <div className="flex gap-2">
          {(["daily", "weekly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                frequency === f
                  ? "bg-amber-500 text-white shadow-sm"
                  : "border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
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
          className="btn-primary disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create habit"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
