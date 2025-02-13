import { FindOptionDto, findOptionSchema } from 'src/types/find-option.dto';
import { UserDto, userSchema } from './user.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export const findUserSchema = userSchema.partial().and(findOptionSchema);

export class FindUserDto extends IntersectionType(
  PartialType(UserDto),
  FindOptionDto,
) {}
