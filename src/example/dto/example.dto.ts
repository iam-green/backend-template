import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const exampleSchema = z.object({
  id: z.string().uuid(),
  created: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v)),
});

export class ExampleDto extends createZodDto(exampleSchema) {
  @ApiProperty({ description: 'Example ID' })
  id: string;

  @ApiProperty({ description: 'Created Date' })
  created: Date;
}
