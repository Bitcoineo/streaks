import { auth } from "@/src/auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { accounts } from "@/src/db/schema";
import SettingsForm from "@/src/components/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Check if user has an OAuth account to determine account type
  const oauthAccounts = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .all();

  const providers = oauthAccounts.map((a) => a.provider);
  const accountType = providers.includes("google")
    ? "Google"
    : "Email / Password";

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Settings</h1>

      <div className="space-y-6">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold">Profile</h2>
          <SettingsForm
            initialName={session!.user.name || ""}
            email={session!.user.email || ""}
          />
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold">Account</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Account type
              </span>
              <p className="font-medium">{accountType}</p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Email
              </span>
              <p className="font-medium">
                {session!.user.email}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
