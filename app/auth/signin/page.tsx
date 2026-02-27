import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import SignInForm from "./signin-form";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/60 to-transparent" />
      <div className="card w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign in to your account
          </p>
        </div>
        <div className="mt-6">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
