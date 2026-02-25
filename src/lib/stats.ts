import { eq, and, asc, desc, gte } from "drizzle-orm";
import { db } from "@/src/db";
import { completions } from "@/src/db/schema";
import { getHabits } from "./habits";

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getCurrentStreak(
  userId: string,
  habitId: string
): Promise<number> {
  // Get all completions for this habit, sorted descending
  const rows = await db
    .select({ date: completions.completedDate })
    .from(completions)
    .where(
      and(eq(completions.userId, userId), eq(completions.habitId, habitId))
    )
    .orderBy(desc(completions.completedDate))
    .all();

  if (rows.length === 0) return 0;

  const dates = new Set(rows.map((r) => r.date));
  const today = toISODate(new Date());

  // Streak must include today or yesterday to be "current"
  if (!dates.has(today) && !dates.has(toISODate(addDays(new Date(), -1)))) {
    return 0;
  }

  // Start counting from today (or yesterday if today isn't done yet)
  let current = dates.has(today) ? new Date() : addDays(new Date(), -1);
  let streak = 0;

  while (dates.has(toISODate(current))) {
    streak++;
    current = addDays(current, -1);
  }

  return streak;
}

export async function getLongestStreak(
  userId: string,
  habitId: string
): Promise<number> {
  const rows = await db
    .select({ date: completions.completedDate })
    .from(completions)
    .where(
      and(eq(completions.userId, userId), eq(completions.habitId, habitId))
    )
    .orderBy(asc(completions.completedDate))
    .all();

  if (rows.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].date);
    const curr = new Date(rows[i].date);
    const diffDays =
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export async function getCompletionRate(
  userId: string,
  habitId: string,
  days: number
): Promise<number> {
  const startDate = toISODate(addDays(new Date(), -(days - 1)));

  const rows = await db
    .select({ date: completions.completedDate })
    .from(completions)
    .where(
      and(
        eq(completions.userId, userId),
        eq(completions.habitId, habitId),
        gte(completions.completedDate, startDate)
      )
    )
    .all();

  if (days === 0) return 0;
  return Math.round((rows.length / days) * 100);
}

export async function getDashboardStats(userId: string) {
  const activeHabits = await getHabits(userId);

  const stats = await Promise.all(
    activeHabits.map(async (habit) => ({
      habit,
      currentStreak: await getCurrentStreak(userId, habit.id),
      completionRate7d: await getCompletionRate(userId, habit.id, 7),
    }))
  );

  return stats;
}
