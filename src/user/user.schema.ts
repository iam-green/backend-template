import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  created: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
