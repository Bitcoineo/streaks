import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import SignInForm from "./signin-form";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
