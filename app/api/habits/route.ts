import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { getRequiredSession, unauthorized, validateBody } from "@/src/lib/auth-helpers";
import { createHabit, getHabits } from "@/src/lib/habits";

const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]).optional(),
});

export async function GET() {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const habits = await getHabits(session.user.id);
  return NextResponse.json({ habits });
}

export async function POST(request: Request) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const data = await validateBody(request, createHabitSchema);
  if (data instanceof NextResponse) return data;

  const result = await createHabit(session.user.id, data);
  return NextResponse.json({ habit: result.data }, { status: 201 });
}
