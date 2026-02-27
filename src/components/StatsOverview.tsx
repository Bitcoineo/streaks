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
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-2xl font-extrabold">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-sm text-stone-500">
            completed today
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-extrabold">
            {bestStreak.streak > 0 ? (
              <span>
                🔥 {bestStreak.streak}d
              </span>
            ) : (
              "—"
            )}
          </div>
          <div className="text-sm text-stone-500">
            {bestStreak.streak > 0
              ? `best streak (${bestStreak.emoji} ${bestStreak.name})`
              : "best streak"}
          </div>
        </div>
      </div>

      {/* Per-habit bars */}
      <div className="card p-5 space-y-4">
        {stats.map((s) => (
          <div key={s.habitId} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>
                {s.habitEmoji} {s.habitName}
                {s.currentStreak > 0 && (
                  <span className="ml-2 text-orange-500">
                    🔥 {s.currentStreak}d
                  </span>
                )}
              </span>
              <span className="text-stone-500">
                {s.completionRate7d}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-stone-100">
              <div
                className="h-2.5 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${s.completionRate7d}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
