import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  DrizzleProvider,
  DrizzleProviderType,
} from 'src/database/database.module';
import { oauth } from './oauth.schema';
import { oauthTypeEnum } from 'src/database/database.enum';
import { CreateOAuthDto, OAuthDto, UpdateOAuthDto } from './dto';
import typia from 'typia';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: DrizzleProviderType,
  ) {}

  async get(id: string) {
    return typia.assert<OAuthDto | undefined>(
      await this.db.query.oauth.findFirst({
        where: eq(oauth.id, id),
      }),
    );
  }

  async getByUser(
    userId: string,
    type: (typeof oauthTypeEnum.enumValues)[number],
  ) {
    return typia.assert<OAuthDto | undefined>(
      await this.db.query.oauth.findFirst({
        where: and(eq(oauth.user_id, userId), eq(oauth.type, type)),
      }),
    );
  }

  async create(data: CreateOAuthDto) {
    return typia.assert<OAuthDto>(
      await this.db
        .insert(oauth)
        .values(data)
        .onConflictDoNothing()
        .returning(),
    );
  }

  async update(id: string, data: UpdateOAuthDto) {
    return typia.assert<OAuthDto>(
      await this.db.update(oauth).set(data).where(eq(oauth.id, id)).returning(),
    );
  }

  async delete(id: string) {
    await this.db.delete(oauth).where(eq(oauth.id, id));
  }
}
