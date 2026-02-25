import { eq, and, asc } from "drizzle-orm";
import { db } from "@/src/db";
import { habits } from "@/src/db/schema";

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

export async function createHabit(
  userId: string,
  input: { name: string; emoji?: string; frequency?: "daily" | "weekly" }
): Promise<Result<typeof habits.$inferSelect>> {
  const habit = await db
    .insert(habits)
    .values({
      userId,
      name: input.name,
      emoji: input.emoji ?? "✅",
      frequency: input.frequency ?? "daily",
    })
    .returning()
    .get();

  return { data: habit };
}

export async function getHabits(userId: string) {
  return db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isArchived, false)))
    .orderBy(asc(habits.createdAt))
    .all();
}

export async function getHabitById(userId: string, habitId: string) {
  return db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .get();
}

export async function updateHabit(
  userId: string,
  habitId: string,
  input: { name?: string; emoji?: string; frequency?: "daily" | "weekly" }
): Promise<Result<typeof habits.$inferSelect>> {
  const existing = await getHabitById(userId, habitId);
  if (!existing) return { error: "Not found" };

  const habit = await db
    .update(habits)
    .set({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.emoji !== undefined && { emoji: input.emoji }),
      ...(input.frequency !== undefined && { frequency: input.frequency }),
      updatedAt: new Date(),
    })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning()
    .get();

  return { data: habit! };
}

export async function archiveHabit(
  userId: string,
  habitId: string
): Promise<Result<{ success: true }>> {
  const existing = await getHabitById(userId, habitId);
  if (!existing) return { error: "Not found" };

  await db
    .update(habits)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  return { data: { success: true } };
}
