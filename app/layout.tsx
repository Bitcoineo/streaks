import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { auth, signOut } from "@/src/auth";
import ThemeToggle from "@/src/components/ThemeToggle";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Streaks — Habit Tracker",
    template: "%s | Streaks",
  },
  description: "Track your habits. Build streaks. Stay consistent.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Streaks — Habit Tracker",
    description: "Track your habits. Build streaks. Stay consistent.",
    siteName: "Streaks",
    type: "website",
  },
};

const themeScript = `
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
            >
              Streaks
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard/settings"
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    {session.user.name || session.user.email}
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
