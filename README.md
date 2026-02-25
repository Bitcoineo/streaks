# Streaks — Habit Tracker

A daily habit tracker built with Next.js 14. Create habits, check them off each day, and watch your streaks grow.

## Features

- **Email/password and Google OAuth** authentication
- **Create habits** with name, emoji, and frequency (daily/weekly)
- **Toggle completions** — check off habits for any date
- **Streak tracking** — current streak and 7-day completion rate per habit
- **Week view** — visual grid of the last 7 days across all habits
- **Dashboard stats** — completion count, best streak, progress bars
- **Dark mode** — toggle or follow system preference
- **Settings page** — edit display name, view account type
- **Data isolation** — each user only sees their own data

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, strict mode)
- **Styling**: Tailwind CSS
- **ORM**: Drizzle ORM
- **Database**: Turso / libSQL (SQLite)
- **Auth**: Auth.js v5 (JWT sessions, Credentials + Google OAuth)
- **Password hashing**: bcryptjs
- **Validation**: Zod
- **Package manager**: pnpm
- **Deploy target**: Vercel

## Local Setup

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### 1. Clone and install

```bash
git clone <repo-url>
cd 14.streaks
pnpm install
```

### 2. Environment variables

Copy the example and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description | Local dev value |
|---|---|---|
| `DATABASE_URL` | Turso database URL | `file:local.db` (default, no config needed) |
| `DATABASE_AUTH_TOKEN` | Turso auth token | Leave empty for local dev |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT signing secret | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | See below |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | See below |

### 3. Google OAuth setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret into `.env.local`

> Google OAuth is optional for local development. Email/password auth works without it.

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Run migrations + production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate new migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |

## Project Structure

```
app/
  layout.tsx                          # Root layout: header, theme, auth state
  page.tsx                            # Landing page (public)
  auth/
    signin/page.tsx                   # Sign in page
    signup/page.tsx                   # Sign up page
  dashboard/
    page.tsx                          # Main dashboard (protected)
    loading.tsx                       # Skeleton loading state
    settings/page.tsx                 # User settings
  api/
    auth/[...nextauth]/route.ts       # Auth.js handler
    auth/signup/route.ts              # Custom signup
    habits/route.ts                   # GET list, POST create
    habits/[id]/route.ts              # PUT update, DELETE archive
    habits/[id]/complete/route.ts     # POST toggle completion
    stats/route.ts                    # GET dashboard stats
    settings/route.ts                 # PATCH update name
src/
  auth.ts                             # Auth.js config (Node runtime)
  auth.config.ts                      # Auth.js config (Edge runtime)
  db/
    index.ts                          # Drizzle client
    schema.ts                         # Database schema
    migrate.ts                        # Migration runner
  lib/
    auth-helpers.ts                   # getRequiredSession helper
    habits.ts                         # Habit CRUD
    completions.ts                    # Completion toggle + queries
    stats.ts                          # Streak + rate calculations
  components/
    HabitList.tsx                     # Habit rows with optimistic toggle
    AddHabitForm.tsx                  # Create habit form
    StatsOverview.tsx                 # Stats cards + progress bars
    WeekView.tsx                      # 7-day completion grid
    ThemeToggle.tsx                   # Dark mode toggle
    SettingsForm.tsx                  # Edit display name
middleware.ts                         # Route protection
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — Turso database URL (`libsql://...turso.io`)
   - `DATABASE_AUTH_TOKEN` — Turso auth token
   - `NEXTAUTH_URL` — Production URL (`https://your-domain.com`)
   - `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` — Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
4. Deploy — migrations run automatically as part of the build script
