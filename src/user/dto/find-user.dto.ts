import { FindOptionDto } from 'src/types/find-option.dto';
import { userSchema } from '../user.schema';
import { createZodDto } from 'nestjs-zod';

export const findUserSchema = userSchema.partial().and(FindOptionDto);

export class FindUserDto extends createZodDto(findUserSchema) {}
