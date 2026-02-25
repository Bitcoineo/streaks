import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";
// =============================================================================
// AUTH TABLES — column names must match @auth/drizzle-adapter exactly.
// See: node_modules/@auth/drizzle-adapter/src/lib/sqlite.ts
//
// Key quirks from the adapter:
//   - Table names are SINGULAR: "user", "account", "session", "verificationToken"
//   - accounts has NO id column — composite PK on (provider, providerAccountId)
//   - sessions uses sessionToken as PK — no separate id
//   - Mixed naming: camelCase (userId, sessionToken) + snake_case (refresh_token)
//   - Timestamps use mode: "timestamp_ms" (milliseconds), not "timestamp" (seconds)
// =============================================================================

type AdapterAccountType = "oauth" | "oidc" | "email" | "webauthn";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  hashedPassword: text("hashedPassword"), // null for OAuth-only users
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
  ]
);

// =============================================================================
// APP TABLES
// =============================================================================

export const habits = sqliteTable(
  "habit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    emoji: text("emoji").notNull().default("✅"),
    frequency: text("frequency", { enum: ["daily", "weekly"] })
      .notNull()
      .default("daily"),
    isArchived: integer("isArchived", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("habits_user_id_idx").on(table.userId),
  ]
);

export const completions = sqliteTable(
  "completion",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    habitId: text("habitId")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    completedDate: text("completedDate").notNull(), // ISO date: "2026-02-25"
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("completions_habit_date_idx").on(
      table.habitId,
      table.completedDate
    ),
    index("completions_user_date_idx").on(table.userId, table.completedDate),
  ]
);
