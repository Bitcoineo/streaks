# Lessons Learned

## 1. Use the correct stack
**Mistake:** Defaulted to Prisma + Neon PostgreSQL instead of the user's established stack.
**Rule:** Always use Drizzle ORM + Turso/libSQL. Reference projects 12.linkVault and 13.snip for patterns. Never assume Prisma or PostgreSQL.
