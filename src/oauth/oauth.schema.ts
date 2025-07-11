import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { oauthTypeEnum } from 'src/database/database.enum';
import { user } from 'src/user/user.schema';

export const oauth = pgTable('oauth', {
  id: uuid().primaryKey().defaultRandom(),
  oauth_id: text().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: oauthTypeEnum().notNull(),
  access_token: text(),
  refresh_token: text(),
  token_expire: timestamp({ withTimezone: true }).notNull(),
  created: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
