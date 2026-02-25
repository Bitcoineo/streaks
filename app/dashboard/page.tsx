import { auth } from "@/src/auth";
import { getHabits } from "@/src/lib/habits";
import { getDashboardStats } from "@/src/lib/stats";
import { getCompletions } from "@/src/lib/completions";
import HabitList from "@/src/components/HabitList";
import AddHabitForm from "@/src/components/AddHabitForm";
import StatsOverview from "@/src/components/StatsOverview";
import WeekView from "@/src/components/WeekView";

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const today = toISODate(new Date());
  const weekStart = toISODate(addDays(new Date(), -6));

  const [habits, stats, weekCompletions] = await Promise.all([
    getHabits(userId),
    getDashboardStats(userId),
    getCompletions(userId, weekStart, today),
  ]);

  const todayCompletedIds = weekCompletions
    .filter((c) => c.completedDate === today)
    .map((c) => c.habitId);

  // Serialize habits for client components (Date → string)
  const serializedHabits = habits.map((h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    frequency: h.frequency,
  }));

  const serializedStats = stats.map((s) => ({
    habitId: s.habit.id,
    habitName: s.habit.name,
    habitEmoji: s.habit.emoji,
    currentStreak: s.currentStreak,
    completionRate7d: s.completionRate7d,
  }));

  const serializedCompletions = weekCompletions.map((c) => ({
    habitId: c.habitId,
    completedDate: c.completedDate,
  }));

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{dateStr}</h1>
      </div>

      {habits.length === 0 ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              No habits yet — create your first one!
            </p>
          </div>
          <AddHabitForm />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today&apos;s Habits</h2>
            </div>
            <HabitList
              habits={serializedHabits}
              stats={serializedStats}
              todayCompletedIds={todayCompletedIds}
              today={today}
            />
            <div className="mt-4">
              <AddHabitForm />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Stats</h2>
            <StatsOverview
              stats={serializedStats}
              todayCompletedIds={todayCompletedIds}
              totalHabits={habits.length}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">This Week</h2>
            <WeekView
              habits={serializedHabits}
              completions={serializedCompletions}
            />
          </section>
        </div>
      )}
    </div>
  );
}
