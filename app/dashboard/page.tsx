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
    <div className="relative mx-auto max-w-3xl px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/40 to-transparent dark:from-amber-950/10 dark:to-transparent" />

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">{dateStr}</h1>
      </div>

      {habits.length === 0 ? (
        <div className="space-y-6">
          <div className="card border-dashed p-12 text-center">
            <p className="text-lg text-stone-500 dark:text-stone-400">
              No habits yet — create your first one!
            </p>
          </div>
          <AddHabitForm />
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Today&apos;s Habits</h2>
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
            <h2 className="mb-4 text-lg font-bold">Stats</h2>
            <StatsOverview
              stats={serializedStats}
              todayCompletedIds={todayCompletedIds}
              totalHabits={habits.length}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold">This Week</h2>
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
