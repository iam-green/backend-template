import { UserDto, userSchema } from './user.dto';
import { OmitType } from '@nestjs/swagger';

export const createUserSchema = userSchema.omit({ id: true, created: true });

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'created',
] as const) {}
