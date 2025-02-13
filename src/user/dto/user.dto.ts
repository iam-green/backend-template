import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  google_id: z.string().nullable(),
  email: z.string().email(),
  created: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v)),
});

export class UserDto extends createZodDto(userSchema) {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: "User's Google ID", required: false })
  google_id: string | null;

  @ApiProperty({ description: 'E-Mail' })
  email: string;

  @ApiProperty({ description: 'Created Date' })
  created: Date;
}
