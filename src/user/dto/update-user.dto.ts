import { CreateUserDto, createUserSchema } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export const updateUserSchema = createUserSchema.partial();

export class UpdateUserDto extends PartialType(CreateUserDto) {}
