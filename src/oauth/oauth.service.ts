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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: DrizzleProviderType,
    private readonly configService: ConfigService,
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

  async getAccessToken(
    userId: string,
    type: (typeof oauthTypeEnum.enumValues)[number],
  ) {
    const data = await this.getByUser(userId, type);
    return data?.access_token ?? undefined;
  }

  async getRefreshToken(
    userId: string,
    type: (typeof oauthTypeEnum.enumValues)[number],
  ) {
    const data = await this.getByUser(userId, type);
    return data?.refresh_token ?? undefined;
  }

  async refreshDiscordToken(userId: string) {
    const oauth = await this.getByUser(userId, 'discord');
    if (!oauth) return undefined;

    const clientId = this.configService.get<string>(
      'DISCORD_OAUTH_CLIENT_ID',
      '',
    );
    const clientSecret = this.configService.get<string>(
      'DISCORD_OAUTH_CLIENT_SECRET',
      '',
    );

    const result = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: oauth.refresh_token,
      }),
    });
    if (!result.ok) return undefined;

    const data = (await result.json()) as {
      access_token: string;
      refresh_token: string;
    };

    await this.update(oauth.id, {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_expire: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    return data.access_token;
  }
}
