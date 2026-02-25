import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { getRequiredSession, unauthorized } from "@/src/lib/auth-helpers";
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

  const body = await request.json();
  const parsed = completeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await toggleCompletion(
    session.user.id,
    params.id,
    parsed.data.date
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data);
}
