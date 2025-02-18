import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  google_id: z.string().nullish(),
  discord_id: z.string().nullish(),
  email: z.string().email(),
  created: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v)),
});

export class UserDto extends createZodDto(userSchema) {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({
    description: "User's Google ID",
    required: false,
    nullable: true,
  })
  google_id: string | null | undefined;

  @ApiProperty({
    description: "User's Discord ID",
    required: false,
    nullable: true,
  })
  discord_id: string | null | undefined;

  @ApiProperty({ description: 'E-Mail' })
  email: string;

  @ApiProperty({ description: 'Created Date' })
  created: Date;
}
