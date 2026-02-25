import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { getRequiredSession, unauthorized } from "@/src/lib/auth-helpers";
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

  const body = await request.json();
  const parsed = createHabitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createHabit(session.user.id, parsed.data);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ habit: result.data }, { status: 201 });
}
