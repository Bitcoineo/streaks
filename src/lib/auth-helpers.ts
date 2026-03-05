import { NextResponse } from "next/server";
import type { ZodType } from "zod/v4";
import { auth } from "@/src/auth";

export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session as typeof session & { user: { id: string } };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function validateBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<T | NextResponse> {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return parsed.data;
}
