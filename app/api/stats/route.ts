import { NextResponse } from "next/server";
import { getRequiredSession, unauthorized } from "@/src/lib/auth-helpers";
import { getDashboardStats } from "@/src/lib/stats";

export async function GET() {
  const session = await getRequiredSession();
  if (!session) return unauthorized();

  const stats = await getDashboardStats(session.user.id);
  return NextResponse.json({ stats });
}
