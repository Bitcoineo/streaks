# Streaks — Implementation Checklist

## Phase 1: Foundation
- [ ] Initialize Next.js project with TypeScript, Tailwind CSS, App Router
- [ ] Install Drizzle ORM (`drizzle-orm`, `drizzle-kit`) + `@libsql/client`
- [ ] Create `src/db/schema.ts` with all tables (auth + app)
- [ ] Create `src/db/index.ts` (Drizzle client + libSQL connection)
- [ ] Create `drizzle.config.ts`
- [ ] Create `src/db/migrate.ts` (migration runner)
- [ ] Run initial migration via `drizzle-kit generate` + migrate
- [ ] Set up `.env.local`, `.env.example`, verify `.gitignore`

## Phase 2: Authentication
- [ ] Install Auth.js v5 (`next-auth@beta`) + `@auth/drizzle-adapter` + `bcryptjs`
- [ ] Configure Auth.js: `lib/auth.ts` (with Drizzle adapter) + `lib/auth.config.ts` (Edge-compatible)
- [ ] Set up Google OAuth provider + Credentials provider
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Create `app/api/auth/signup/route.ts` (bcrypt hashing + Drizzle insert)
- [ ] Create `middleware.ts` with route protection
- [ ] Build login page with credentials form + Google button
- [ ] Build signup page with registration form

## Phase 3: Core Features
- [ ] Build habit CRUD API routes (`/api/habits`, `/api/habits/[id]`)
- [ ] Build completion toggle API (`/api/habits/[id]/completions`)
- [ ] Build dashboard page with habit list + today's completions
- [ ] Build `lib/streaks.ts` (streak calculation logic)
- [ ] Build `GET /api/stats` endpoint

## Phase 4: Dashboard Polish
- [ ] Build calendar heatmap component
- [ ] Build streak display + stats overview
- [ ] Add loading states (Suspense + skeleton UI)
- [ ] Responsive design pass

## Phase 5: Production
- [ ] Error boundaries + 404/500 pages
- [ ] Rate limiting on auth endpoints
- [ ] Deploy to Vercel + verify env vars + test OAuth in production
