import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleProvider,
  DrizzleProviderType,
} from 'src/database/database.module';
import { CreateUserDto, UpdateUserDto, FindUserDto } from './dto';
import { and, asc, between, desc, eq } from 'drizzle-orm';
import { user } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: DrizzleProviderType,
  ) {}

  async find(data: Partial<FindUserDto>) {
    const {
      id,
      created,
      sort = 'asc',
      page = 1,
      limit = 10,
      from = 0,
      to = Date.now(),
    } = data;

    return this.db.query.user.findMany({
      where: and(
        id ? eq(user.id, id) : undefined,
        created
          ? eq(user.created, created)
          : between(user.created, new Date(from), new Date(to)),
      ),
      orderBy: sort == 'asc' ? [asc(user.created)] : [desc(user.created)],
      offset: (page - 1) * limit,
      limit,
    });
  }

  async get(id: string) {
    return await this.db.query.user.findFirst({
      where: eq(user.id, id),
    });
  }

  async getByEmail(email: string) {
    return await this.db.query.user.findFirst({
      where: eq(user.email, email),
    });
  }

  async getByGoogleId(google_id: string) {
    return await this.db.query.user.findFirst({
      where: eq(user.google_id, google_id),
    });
  }

  async getByDiscordId(discord_id: string) {
    return await this.db.query.user.findFirst({
      where: eq(user.discord_id, discord_id),
    });
  }

  async create(data: CreateUserDto) {
    return (
      await this.db.insert(user).values(data).onConflictDoNothing().returning()
    )[0];
  }

  async update(id: string, data: UpdateUserDto) {
    return (
      await this.db.update(user).set(data).where(eq(user.id, id)).returning()
    )[0];
  }

  async delete(id: string) {
    await this.db.delete(user).where(eq(user.id, id));
  }
}
