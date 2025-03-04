import { FindOptionDto, findOptionSchema } from 'src/types';
import { UserDto, userSchema } from './user.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export const findUserSchema = userSchema.partial().and(findOptionSchema);

export class FindUserDto extends IntersectionType(
  PartialType(UserDto),
  FindOptionDto,
) {}
