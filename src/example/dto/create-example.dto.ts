import { createZodDto } from 'nestjs-zod';
import { exampleSchema } from '../example.schema';

export const createExampleSchema = exampleSchema.omit({
  id: true,
  created: true,
});

export class CreateExampleDto extends createZodDto(createExampleSchema) {}
