import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { getRequiredSession, unauthorized, validateBody } from "@/src/lib/auth-helpers";
import { updateHabit, archiveHabit } from "@/src/lib/habits";

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  emoji: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const data = await validateBody(request, updateHabitSchema);
  if (data instanceof NextResponse) return data;

  const result = await updateHabit(session.user.id, params.id, data);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ habit: result.data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const result = await archiveHabit(session.user.id, params.id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
