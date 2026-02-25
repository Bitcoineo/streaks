"use client";

type Habit = {
  id: string;
  name: string;
  emoji: string;
};

type Completion = {
  habitId: string;
  completedDate: string;
};

type Props = {
  habits: Habit[];
  completions: Completion[];
};

function getLast7Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ date: iso, label });
  }

  return days;
}

export default function WeekView({ habits, completions }: Props) {
  const days = getLast7Days();
  const today = new Date().toISOString().split("T")[0];

  // Build lookup: Set<"habitId:date">
  const completionSet = new Set(
    completions.map((c) => `${c.habitId}:${c.completedDate}`)
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        {/* Day headers */}
        <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}>
          <div />
          {days.map((d) => (
            <div
              key={d.date}
              className={`text-center text-xs font-medium ${
                d.date === today
                  ? "text-foreground"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {d.label}
            </div>
          ))}
        </div>

        {/* Habit rows */}
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="mb-1 grid items-center gap-1"
            style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}
          >
            <div className="flex items-center gap-1.5 truncate text-sm">
              <span>{habit.emoji}</span>
              <span className="truncate text-zinc-600 dark:text-zinc-400">
                {habit.name}
              </span>
            </div>
            {days.map((d) => {
              const done = completionSet.has(`${habit.id}:${d.date}`);
              return (
                <div key={d.date} className="flex justify-center py-1">
                  <div
                    className={`h-6 w-6 rounded-md ${
                      done
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    } ${d.date === today ? "ring-1 ring-zinc-300 dark:ring-zinc-600" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
