import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleProvider } from 'src/database/database.module';
import * as schema from 'src/database/database.schema';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { and, asc, between, desc, eq } from 'drizzle-orm';
import { user } from 'src/database/database.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async find(data: FindUserDto) {
    const { id, created, sort, page, limit, from, to } = data;

    return this.db.query.user.findMany({
      where: and(
        id ? eq(user.id, id) : undefined,
        created ? eq(user.created, created) : between(user.created, from, to),
      ),
      orderBy: sort == 'asc' ? [asc(user.created)] : [desc(user.created)],
      offset: (page - 1) * limit,
      limit,
    });
  }

  async get(id: string) {
    return this.db.query.user.findFirst({
      where: eq(user.id, id),
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
