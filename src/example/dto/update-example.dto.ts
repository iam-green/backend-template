import { createZodDto } from 'nestjs-zod';
import { createExampleSchema } from './create-example.dto';

export const updateExampleSchema = createExampleSchema.partial();

export class UpdateExampleDto extends createZodDto(updateExampleSchema) {}
