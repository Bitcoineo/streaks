import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { getRequiredSession, unauthorized } from "@/src/lib/auth-helpers";

const updateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function PATCH(request: Request) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await db
    .update(users)
    .set({ name: parsed.data.name })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
