import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import SignUpForm from "./signup-form";

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Start tracking your habits today
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
