import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "@/src/db";
import { completions } from "@/src/db/schema";
import { getHabitById } from "./habits";

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

export async function toggleCompletion(
  userId: string,
  habitId: string,
  date: string
): Promise<Result<{ completed: boolean }>> {
  // Verify habit belongs to this user
  const habit = await getHabitById(userId, habitId);
  if (!habit) return { error: "Not found" };

  const existing = await db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.habitId, habitId),
        eq(completions.completedDate, date)
      )
    )
    .get();

  if (existing) {
    await db.delete(completions).where(eq(completions.id, existing.id));
    return { data: { completed: false } };
  }

  await db
    .insert(completions)
    .values({ habitId, userId, completedDate: date });

  return { data: { completed: true } };
}

export async function getCompletions(
  userId: string,
  startDate: string,
  endDate: string
) {
  return db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.userId, userId),
        gte(completions.completedDate, startDate),
        lte(completions.completedDate, endDate)
      )
    )
    .all();
}

export async function getCompletionsByHabit(
  userId: string,
  habitId: string,
  startDate: string,
  endDate: string
) {
  return db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.userId, userId),
        eq(completions.habitId, habitId),
        gte(completions.completedDate, startDate),
        lte(completions.completedDate, endDate)
      )
    )
    .all();
}
