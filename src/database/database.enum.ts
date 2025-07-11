import { pgEnum } from 'drizzle-orm/pg-core';

export const oauthTypeEnum = pgEnum('oauth_type', ['google', 'discord']);
