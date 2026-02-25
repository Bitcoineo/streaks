# Streaks — Habit Tracker

## Overview

Habit tracker with user authentication. Users sign up (email/password or Google OAuth), create habits with name/emoji/frequency (daily or weekly), check them off each day, and view a dashboard with current streaks, completion rates, and a week view grid. All data is scoped to the authenticated user.

## Tech Stack

- **Framework**: Next.js 14, App Router, TypeScript (strict mode)
- **Styling**: Tailwind CSS (class-based dark mode)
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Database**: Turso / libSQL (SQLite) via `@libsql/client`
- **Auth**: Auth.js v5 (`next-auth@beta`) + `@auth/drizzle-adapter`
- **Password hashing**: bcryptjs (pure JS, Vercel-compatible)
- **Validation**: Zod (v4, imported from `zod/v4`)
- **IDs**: `crypto.randomUUID()`
- **Package manager**: pnpm
- **Deploy target**: Vercel

## File Structure

```
app/
  layout.tsx                          # Root layout: header, theme toggle, auth state
  page.tsx                            # Landing page (public, redirects if authed)
  globals.css                         # Tailwind + CSS vars (class-based dark mode)
  auth/
    signin/
      page.tsx                        # Server component: auth check + redirect
      signin-form.tsx                 # Client form: email/password + Google OAuth
    signup/
      page.tsx                        # Server component: auth check + redirect
      signup-form.tsx                 # Client form: name/email/password + Google
  dashboard/
    page.tsx                          # Main dashboard (protected, server component)
    loading.tsx                       # Skeleton loading state
    settings/
      page.tsx                        # User settings (protected)
  api/
    auth/[...nextauth]/route.ts       # Auth.js catch-all handler
    auth/signup/route.ts              # Custom signup (POST)
    habits/route.ts                   # GET list, POST create
    habits/[id]/route.ts              # PUT update, DELETE archive
    habits/[id]/complete/route.ts     # POST toggle completion
    stats/route.ts                    # GET dashboard stats
    settings/route.ts                 # PATCH update display name
src/
  auth.ts                             # Auth.js config WITH Drizzle adapter (Node runtime)
  auth.config.ts                      # Auth.js config WITHOUT adapter (Edge-compatible)
  db/
    index.ts                          # Drizzle client + libSQL connection
    schema.ts                         # All table definitions (auth + app)
    migrate.ts                        # Migration runner
  lib/
    auth-helpers.ts                   # getRequiredSession + unauthorized helpers
    habits.ts                         # Habit CRUD (create, get, update, archive)
    completions.ts                    # Completion toggle + range queries
    stats.ts                          # Streak calculation, completion rates, dashboard stats
  components/
    HabitList.tsx                     # Habit rows with optimistic completion toggle
    AddHabitForm.tsx                  # Inline form with emoji picker + frequency toggle
    StatsOverview.tsx                 # Summary cards + per-habit progress bars
    WeekView.tsx                      # 7-day completion grid
    ThemeToggle.tsx                   # Dark/light mode toggle (localStorage)
    SettingsForm.tsx                  # Edit display name form
drizzle/                              # Generated migration SQL files
drizzle.config.ts
middleware.ts                         # Route protection (Edge-compatible)
```

## Auth Strategy

### Providers
- **Credentials**: Email/password. Passwords hashed with `bcryptjs` (cost factor 12). Custom `POST /api/auth/signup` endpoint handles registration.
- **Google OAuth**: `allowDangerousEmailAccountLinking: true` (Google verifies emails, safe to auto-link).

### Session Strategy: JWT
- `strategy: "jwt"` — no DB hit per request, Edge Runtime compatible, stateless across serverless functions.
- The Drizzle adapter still persists User, Account, and VerificationToken records. It just doesn't store sessions.
- JWT contains `{ sub: user.id, email, name }`. Never contains passwords or hashes.

### Route Protection: Middleware + Defense-in-Depth

**Layer 1 — `middleware.ts`:**
- Matcher: `["/dashboard/:path*", "/api/habits/:path*", "/api/stats/:path*", "/api/settings/:path*"]`
- Pages → redirect to `/auth/signin`
- API routes → return 401 JSON
- `/api/auth/*` is NOT matched (must be reachable to authenticate)

**Layer 2 — Route Handlers:**
- Every handler calls `const session = await getRequiredSession()`
- Returns `unauthorized()` (401) if no session
- Every DB query includes `.where(eq(table.userId, session.user.id))`
- Resource mutations verify ownership: `.where(and(eq(table.id, resourceId), eq(table.userId, userId)))`
- Ownership failures return 404 (not 403) to avoid leaking resource existence

### `auth.ts` vs `auth.config.ts` Split
- `auth.config.ts` exports provider config WITHOUT the Drizzle adapter (Edge-compatible for middleware import)
- `auth.ts` imports `auth.config.ts` and adds the Drizzle adapter + real Credentials authorize logic (Node.js runtime for Route Handlers / Server Components)

## Database

### Connection
- `@libsql/client` with `createClient({ url, authToken })`
- Local dev: `file:local.db`
- Production: `libsql://...turso.io` with auth token
- Drizzle client: `drizzle(client, { schema })`

### Schema (6 tables)

**Auth tables** (column names match `@auth/drizzle-adapter` exactly — singular table names, mixed camelCase/snake_case):
- `user` — id, name, email (unique), emailVerified, image, hashedPassword (nullable for OAuth-only)
- `account` — composite PK on (provider, providerAccountId), userId FK, type, tokens (refresh_token, access_token, etc.)
- `session` — sessionToken as PK, userId FK, expires. Exists for adapter compatibility, empty with JWT strategy
- `verificationToken` — composite PK on (identifier, token), expires

**App tables:**
- `habit` — id, userId FK, name, emoji, frequency ("daily"/"weekly"), isArchived (boolean, default false), createdAt, updatedAt. Index on userId
- `completion` — id, habitId FK, userId FK (denormalized), completedDate (text ISO "2026-02-25"), createdAt. Unique index on (habitId, completedDate). Index on (userId, completedDate)

### Key Schema Decisions
- **Auth table naming**: Must match adapter exactly — singular table names (`user` not `users`), camelCase SQL columns (`userId`, `sessionToken`), `mode: "timestamp_ms"` (milliseconds)
- **App table timestamps**: `integer` with `mode: "timestamp_ms"` + `default(sql\`(unixepoch() * 1000)\`)`
- **IDs**: `text` primary key with `crypto.randomUUID()` default
- **Dates**: `completedDate` is `text` storing ISO strings — SQLite has no DATE type; ISO text sorts lexicographically for correct range queries
- **Enums**: `text` with `{ enum: [...] }` — SQLite has no native enums; Drizzle enforces at TypeScript level
- **Denormalized `userId` on completions** — avoids JOINs for dashboard queries and auth checks
- **`isArchived` boolean** — simple flag for soft-delete filtering (`WHERE isArchived = false`)
- **Unique index on `(habitId, completedDate)`** — DB-level dedup prevents double-logging

## API Contract

### Auth (handled by Auth.js)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signin/credentials` | Email/password login |
| GET | `/api/auth/signin/google` | Initiate Google OAuth |
| GET | `/api/auth/callback/google` | OAuth callback |
| POST | `/api/auth/signout` | Logout |
| GET | `/api/auth/session` | Get current session |

### Custom Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register (validate, hash password, insert user) |

### App (all protected — every query scoped by `session.user.id`)
| Method | Path | Body / Params | Response |
|--------|------|---------------|----------|
| GET | `/api/habits` | — | `{ habits: Habit[] }` (active only) |
| POST | `/api/habits` | `{ name, emoji, frequency }` | `{ habit: Habit }` (201) |
| PUT | `/api/habits/[id]` | `{ name?, emoji?, frequency? }` | `{ habit: Habit }` |
| DELETE | `/api/habits/[id]` | — | `{ success: true }` (soft-delete) |
| POST | `/api/habits/[id]/complete` | `{ date: "YYYY-MM-DD" }` | `{ completed: boolean }` (toggle) |
| GET | `/api/stats` | — | `{ stats: DashboardStat[] }` |
| PATCH | `/api/settings` | `{ name }` | `{ success: true }` |

### Routes
- **Public**: `/`, `/auth/signin`, `/auth/signup`, `/api/auth/*`
- **Protected**: `/dashboard`, `/dashboard/*`, `/api/habits/*`, `/api/stats`, `/api/settings`

## UI Architecture

### Theme
- Class-based dark mode (`darkMode: "class"` in Tailwind config)
- Inline `<script>` in layout reads `localStorage.theme` before paint (no flash)
- ThemeToggle component toggles `.dark` class on `<html>` + persists to localStorage
- Falls back to system `prefers-color-scheme` when no preference saved

### Dashboard Data Flow
- Dashboard page is a server component that fetches all data via direct function calls (no API roundtrip)
- Data is serialized to plain objects before passing to client components
- Client components use optimistic updates for completion toggles
- `router.refresh()` after API mutations re-runs the server component for consistency

### Business Logic Pattern
- Business logic lives in `src/lib/` (habits.ts, completions.ts, stats.ts)
- Functions return `Result<T>` type: `{ data: T }` or `{ error: string }`
- API routes handle validation (Zod), auth (getRequiredSession), then delegate to business logic
- API routes map `{ error }` to appropriate HTTP status codes (404 for not found, 400 for validation)

### Auth Pages
- Sign in/signup pages are server components that redirect to `/dashboard` if already authenticated
- Forms are separate client components using `signIn` from `next-auth/react`
- Sign out uses server action (no SessionProvider needed)

## Coding Standards

- All request bodies validated with Zod schemas before processing
- Every protected route handler: `getRequiredSession()` → extract `userId` → scope all queries
- No raw SQL — use Drizzle query builder exclusively
- Passwords never logged, never in JWT, never returned to client
- Secrets in `.env.local` (gitignored). `.env.example` has placeholders only
- Soft-delete habits via `isArchived` boolean — never hard delete
- Completion toggle is idempotent: exists → delete, not exists → create
- Streak calculation in `src/lib/stats.ts` (queries DB directly, not pure functions)
- Zod v4 imported from `zod/v4`
