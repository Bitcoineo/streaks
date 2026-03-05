import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { getRequiredSession, unauthorized, validateBody } from "@/src/lib/auth-helpers";

const updateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function PATCH(request: Request) {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const data = await validateBody(request, updateSchema);
  if (data instanceof NextResponse) return data;

  await db
    .update(users)
    .set({ name: data.name })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
