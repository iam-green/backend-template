import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleProvider,
  DrizzleProviderType,
} from 'src/database/database.module';
import { CreateUserDto, UpdateUserDto, FindUserDto, UserDto } from './dto';
import { and, asc, between, desc, eq } from 'drizzle-orm';
import { user } from './user.schema';
import typia from 'typia';
import { OAuthService } from 'src/oauth/oauth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: DrizzleProviderType,
    private readonly oauthService: OAuthService,
  ) {}

  async find(data: FindUserDto) {
    const {
      id,
      created,
      sort = 'asc',
      page = 1,
      limit = 10,
      from = 0,
      to = Date.now(),
    } = data;

    return typia.assert<UserDto[]>(
      await this.db.query.user.findMany({
        where: and(
          id ? eq(user.id, id) : undefined,
          created
            ? eq(user.created, created)
            : between(user.created, new Date(from), new Date(to)),
        ),
        orderBy: sort == 'asc' ? [asc(user.created)] : [desc(user.created)],
        offset: (page - 1) * limit,
        limit,
      }),
    );
  }

  async get(id: string) {
    return typia.assert<UserDto | undefined>(
      await this.db.query.user.findFirst({
        where: eq(user.id, id),
      }),
    );
  }

  async getByEmail(email: string) {
    return typia.assert<UserDto | undefined>(
      await this.db.query.user.findFirst({
        where: eq(user.email, email),
      }),
    );
  }

  async getByGoogleId(id: string) {
    const oauth = await this.oauthService.getByUser(id, 'google');
    if (!oauth) return undefined;
    return typia.assert<UserDto | undefined>(
      await this.db.query.user.findFirst({
        where: eq(user.id, oauth.user_id),
      }),
    );
  }

  async getByDiscordId(id: string) {
    const oauth = await this.oauthService.getByUser(id, 'discord');
    if (!oauth) return undefined;
    return typia.assert<UserDto | undefined>(
      await this.db.query.user.findFirst({
        where: eq(user.id, oauth.user_id),
      }),
    );
  }

  async create(data: CreateUserDto) {
    return typia.assert<UserDto>(
      (
        await this.db
          .insert(user)
          .values(data)
          .onConflictDoNothing()
          .returning()
      )[0],
    );
  }

  async update(id: string, data: UpdateUserDto) {
    return typia.assert<UserDto>(
      (
        await this.db.update(user).set(data).where(eq(user.id, id)).returning()
      )[0],
    );
  }

  async delete(id: string) {
    await this.db.delete(user).where(eq(user.id, id));
  }
}
