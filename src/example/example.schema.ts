import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const example = pgTable('example', {
  id: uuid('id').primaryKey().defaultRandom(),
  created: timestamp('created', { withTimezone: true }).notNull().defaultNow(),
});

export const exampleSchema = z.object({
  id: z.string().uuid().describe('Example ID'),
  created: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v))
    .describe('Created Date'),
});
