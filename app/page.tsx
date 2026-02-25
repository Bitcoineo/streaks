import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-32">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-center">
        Track your habits.
        <br />
        Build streaks.
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
        Stay consistent with a simple daily habit tracker.
        Check off your habits, watch your streaks grow, and see your progress
        over time.
      </p>
      <Link
        href="/auth/signup"
        className="mt-8 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
}
