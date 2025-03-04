import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/database.schema';
import {
  CreateExampleDto,
  UpdateExampleDto,
  FindExampleDto,
  findExampleSchema,
} from './dto';
import { and, asc, between, desc, eq } from 'drizzle-orm';
import { example } from '../database/database.schema';
import { DrizzleProvider } from '../database/database.module';

@Injectable()
export class ExampleService {
  constructor(
    @Inject(DrizzleProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async find(data: Partial<FindExampleDto>) {
    const { id, created, sort, page, limit, from, to } =
      findExampleSchema.parse(data);

    return this.db.query.example.findMany({
      where: and(
        id ? eq(example.id, id) : undefined,
        created
          ? eq(example.created, created)
          : between(example.created, from, to),
      ),

      orderBy: sort == 'asc' ? [asc(example.created)] : [desc(example.created)],
      offset: (page - 1) * limit,
      limit,
    });
  }

  async get(id: string) {
    return this.db.query.example.findFirst({
      where: eq(example.id, id),
    });
  }

  async create(data: CreateExampleDto) {
    return (
      await this.db
        .insert(example)
        .values(data)
        .onConflictDoNothing()
        .returning()
    )[0];
  }

  async update(id: string, data: UpdateExampleDto) {
    return (
      await this.db
        .update(example)
        .set(data)
        .where(eq(example.id, id))
        .returning()
    )[0];
  }

  async delete(id: string) {
    await this.db.delete(example).where(eq(example.id, id));
  }
}
