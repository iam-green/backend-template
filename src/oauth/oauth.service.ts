import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  DrizzleProvider,
  DrizzleProviderType,
} from 'src/database/database.module';
import { oauth } from './oauth.schema';
import { oauthTypeEnum } from 'src/database/database.enum';
import { CreateOAuthDto, UpdateOAuthDto } from './dto';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: DrizzleProviderType,
  ) {}

  async get(id: string) {
    return await this.db.query.oauth.findFirst({
      where: eq(oauth.id, id),
    });
  }

  async getByUser(
    userId: string,
    type: (typeof oauthTypeEnum.enumValues)[number],
  ) {
    return await this.db.query.oauth.findFirst({
      where: and(eq(oauth.user_id, userId), eq(oauth.type, type)),
    });
  }

  async create(data: CreateOAuthDto) {
    return await this.db.insert(oauth).values(data).returning();
  }

  async update(id: string, data: UpdateOAuthDto) {
    return await this.db
      .update(oauth)
      .set({ ...data, updated: new Date() })
      .where(eq(oauth.id, id))
      .returning();
  }

  async delete(id: string) {
    await this.db.delete(oauth).where(eq(oauth.id, id));
  }
}
