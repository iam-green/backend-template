import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const findOptionSchema = z.object({
  sort: z
    .enum(['asc', 'desc'])
    .nullish()
    .default('asc')
    .transform((v) => v ?? 'asc'),
  page: z.coerce
    .number()
    .nullish()
    .default(1)
    .transform((v) => v ?? 1),
  limit: z.coerce.number().default(10),
  from: z.coerce
    .date()
    .or(z.coerce.number())
    .nullish()
    .default(new Date(0))
    .transform((v) => new Date(v ?? 0)),
  to: z.coerce
    .date()
    .or(z.coerce.number())
    .nullish()
    .default(() => new Date())
    .transform((v) => new Date(v ?? new Date())),
});

export class FindOptionDto extends createZodDto(findOptionSchema) {
  @ApiProperty({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    required: false,
  })
  sort: 'asc' | 'desc' = 'asc';

  @ApiProperty({
    description: 'Page number',
    default: 1,
    minimum: 1,
    required: false,
  })
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    required: false,
  })
  limit: number = 10;

  @ApiProperty({
    description: 'From date',
    default: new Date(0),
    required: false,
  })
  from: Date = new Date(0);

  @ApiProperty({
    description: 'To date',
    default: () => new Date(),
    required: false,
  })
  to: Date = new Date();
}
