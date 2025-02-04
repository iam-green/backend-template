import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './database.schema';
import { Client } from 'pg';

export const DrizzleProvider = 'DrizzleProvider';

@Module({
  providers: [
    {
      provide: DrizzleProvider,
      useFactory: async (configService: ConfigService) => {
        const client = new Client(configService.get<string>('DATABASE_URL'));
        const db = drizzle(client, { schema });
        await client.connect();
        await migrate(db, { migrationsFolder: `./src/database/migration` });
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DrizzleProvider],
})
export class DatabaseModule {}
