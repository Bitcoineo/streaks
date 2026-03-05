import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { getRequiredSession, unauthorized, validateBody } from "@/src/lib/auth-helpers";
import { toggleCompletion } from "@/src/lib/completions";

const completeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const data = await validateBody(request, completeSchema);
  if (data instanceof NextResponse) return data;

  const result = await toggleCompletion(
    session.user.id,
    params.id,
    data.date
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data);
}
