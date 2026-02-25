"use client";

type Stat = {
  habitId: string;
  habitName: string;
  habitEmoji: string;
  currentStreak: number;
  completionRate7d: number;
};

type Props = {
  stats: Stat[];
  todayCompletedIds: string[];
  totalHabits: number;
};

export default function StatsOverview({
  stats,
  todayCompletedIds,
  totalHabits,
}: Props) {
  const completedToday = todayCompletedIds.length;
  const bestStreak = stats.reduce(
    (best, s) =>
      s.currentStreak > best.streak
        ? { streak: s.currentStreak, name: s.habitName, emoji: s.habitEmoji }
        : best,
    { streak: 0, name: "", emoji: "" }
  );

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            completed today
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold">
            {bestStreak.streak > 0 ? (
              <span>
                🔥 {bestStreak.streak}d
              </span>
            ) : (
              "—"
            )}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {bestStreak.streak > 0
              ? `best streak (${bestStreak.emoji} ${bestStreak.name})`
              : "best streak"}
          </div>
        </div>
      </div>

      {/* Per-habit bars */}
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.habitId} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>
                {s.habitEmoji} {s.habitName}
                {s.currentStreak > 0 && (
                  <span className="ml-2 text-orange-500 dark:text-orange-400">
                    🔥 {s.currentStreak}d
                  </span>
                )}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {s.completionRate7d}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all"
                style={{ width: `${s.completionRate7d}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
