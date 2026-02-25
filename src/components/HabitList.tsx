"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: string;
};

type Stat = {
  habitId: string;
  currentStreak: number;
};

type Props = {
  habits: Habit[];
  stats: Stat[];
  todayCompletedIds: string[];
  today: string;
};

export default function HabitList({
  habits,
  stats,
  todayCompletedIds,
  today,
}: Props) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function isCompleted(habitId: string) {
    if (habitId in optimistic) return optimistic[habitId];
    return todayCompletedIds.includes(habitId);
  }

  async function toggle(habitId: string) {
    if (pending[habitId]) return;

    const current = isCompleted(habitId);
    const next = !current;

    // Optimistic update
    setOptimistic((prev) => ({ ...prev, [habitId]: next }));
    setPending((prev) => ({ ...prev, [habitId]: true }));

    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });

      if (!res.ok) {
        setOptimistic((prev) => ({ ...prev, [habitId]: current }));
        setError("Failed to update. Please try again.");
        setTimeout(() => setError(""), 3000);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setOptimistic((prev) => ({ ...prev, [habitId]: current }));
      setError("Network error. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setPending((prev) => ({ ...prev, [habitId]: false }));
    }
  }

  function getStreak(habitId: string) {
    return stats.find((s) => s.habitId === habitId)?.currentStreak ?? 0;
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {habits.map((habit) => {
        const completed = isCompleted(habit.id);
        const streak = getStreak(habit.id);

        return (
          <div
            key={habit.id}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              completed
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            <span className="text-xl">{habit.emoji}</span>
            <span
              className={`flex-1 font-medium ${
                completed
                  ? "text-emerald-700 dark:text-emerald-400"
                  : ""
              }`}
            >
              {habit.name}
            </span>

            {streak > 0 && (
              <span className="flex items-center gap-1 text-sm text-orange-500 dark:text-orange-400">
                <span>🔥</span>
                <span>{streak}d</span>
              </span>
            )}

            <button
              onClick={() => toggle(habit.id)}
              disabled={pending[habit.id]}
              className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                completed
                  ? "border-emerald-400 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600"
                  : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
              } ${pending[habit.id] ? "opacity-50" : ""}`}
              aria-label={
                completed ? `Uncheck ${habit.name}` : `Check ${habit.name}`
              }
            >
              {completed && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
