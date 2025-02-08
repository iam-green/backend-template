import { createZodDto } from 'nestjs-zod';
import { userSchema } from '../user.schema';

export const createUserSchema = userSchema.omit({ id: true, created: true });

export class CreateUserDto extends createZodDto(createUserSchema) {}
