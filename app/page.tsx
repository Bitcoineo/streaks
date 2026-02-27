import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";

const features = [
  { emoji: "🔥", title: "Streak Tracking", description: "Watch your streaks grow as you stay consistent day after day." },
  { emoji: "✅", title: "Daily Check-ins", description: "One tap to mark a habit complete. Simple and satisfying." },
  { emoji: "📊", title: "Visual Progress", description: "See your week at a glance with a clean completion grid." },
  { emoji: "🎯", title: "Stay Focused", description: "Track only what matters. No clutter, no distractions." },
  { emoji: "📱", title: "Clean Design", description: "A beautiful, minimal interface that stays out of your way." },
  { emoji: "🔒", title: "Private & Secure", description: "Your data is yours. Fully authenticated, fully isolated." },
];

const previewHabits = [
  { emoji: "🏃", name: "Morning Run", streak: 12, done: true },
  { emoji: "📚", name: "Read 30 mins", streak: 8, done: true },
  { emoji: "💧", name: "Drink 2L Water", streak: 5, done: false },
  { emoji: "🧘", name: "Meditate", streak: 21, done: true },
];

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pb-24 pt-20 md:pb-32 md:pt-28">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-transparent" />
        <div className="absolute top-20 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="opacity-0 animate-fade-in-up delay-0">
            <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
              Track habits, build streaks
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl opacity-0 animate-fade-in-up delay-1">
            Build better habits,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              one day at a time
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 opacity-0 animate-fade-in-up delay-2">
            A simple, beautiful habit tracker that helps you stay consistent.
            Check off your daily habits, watch your streaks grow, and see your
            progress over time.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center opacity-0 animate-fade-in-up delay-3">
            <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base">
              Get Started Free
            </Link>
            <Link href="/auth/signin" className="btn-secondary px-8 py-3 text-base">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="text-amber-500">stay on track</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              Simple tools that make habit tracking effortless and rewarding.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                  {feature.emoji}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-stone-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your habits, at a glance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-600">
              A clean dashboard that shows you exactly where you stand.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-stone-200/60 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Today&apos;s Habits</h3>
              <span className="text-sm text-stone-500">3 of 4 done</span>
            </div>
            <div className="space-y-3">
              {previewHabits.map((habit) => (
                <div
                  key={habit.name}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                    habit.done
                      ? "bg-emerald-50"
                      : "bg-stone-50"
                  }`}
                >
                  <span className="text-xl">{habit.emoji}</span>
                  <span className={`flex-1 font-medium ${habit.done ? "text-emerald-700" : ""}`}>
                    {habit.name}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-orange-500">
                    🔥 {habit.streak}d
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      habit.done
                        ? "bg-emerald-500 text-white"
                        : "border border-stone-300"
                    }`}
                  >
                    {habit.done && (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to build your streaks?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-stone-600">
            Start tracking your habits today. It&apos;s free and takes less than a minute to set up.
          </p>
          <Link href="/auth/signup" className="btn-primary mt-8 inline-block px-8 py-3 text-base">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
