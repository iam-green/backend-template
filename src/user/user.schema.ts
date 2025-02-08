import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const user = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  google_id: text().unique(),
  email: text().unique().notNull(),
  created: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const userSchema = z.object({
  id: z.string().uuid().describe('User ID'),
  google_id: z.string().nullable().describe("User's Google ID"),
  email: z.string().email().describe('Email'),
  created: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v))
    .describe('Created Date'),
});
