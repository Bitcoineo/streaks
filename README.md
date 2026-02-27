# Streaks

Habit tracker with real authentication. Build habits with daily or weekly frequency goals, track streaks, and see your progress in a 7-day grid view.

**Stack:** `Next.js 14 · TypeScript · Auth.js v5 · Drizzle ORM · Turso (SQLite) · Tailwind CSS · Vercel`

**Live:** https://streaks-bitcoineo.vercel.app

---

## Why I built this

I wanted to build something that required real multi-user authentication, not just a single-user localStorage app. Streaks was the vehicle for learning Auth.js v5 with both Google OAuth and email/password (bcrypt), the Drizzle adapter for session persistence, and proper per-user data isolation at the database level.

## Features

- **Authentication** Email/password with bcrypt and Google OAuth via Auth.js v5
- **Habits** Create habits with name, emoji, and daily or weekly frequency
- **Completion toggle** One-tap completion with optimistic UI
- **Streak tracking** Current streak and 7-day completion rer habit
- **Week view** Grid showing daily progress across all habits
- **Dashboard stats** Progress bars and summary cards
- **Settings** Profile management page
- **Per-user isolation** All data scoped to the authenticated user

## Setup

    git clone https://github.com/Bitcoineo/streaks.git
    cd streaks
    pnpm install
    cp .env.example .env

Fill in your .env:

    DATABASE_URL=           # Turso database URL
    DATABASE_AUTH_TOKEN=    # Turso auth token
    AUTH_SECRET=            # Random string (run: openssl rand -base64 32)
    GOOGLE_CLIENT_ID=       # From Google Cloud Console
    GOOGLE_CLIENT_SECRET=   # From Google Cloud Console

Run migrations:

    pnpm db:generate
    pnpm db:migrate

Start dev server:

    pnpm dev

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on Vercel
3. Add all environment variables from .env
4. Deploy

## GitHub Topics

`nextjs` `typescript` `auth` `authjs` `google-oauth` `drizzle-orm` `turso` `sqlite` `tailwind` `habit-tracker` `vercel`
