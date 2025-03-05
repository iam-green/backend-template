import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/database.schema.ts',
  out: './src/database/migration',
  dbCredentials: { url: process.env.DATABASE_URL },
});
