import { FindOptionDto } from 'src/types/find-option.dto';
import { exampleSchema } from '../example.schema';
import { createZodDto } from 'nestjs-zod';

export const findExampleSchema = exampleSchema.partial().and(FindOptionDto);

export class FindExampleDto extends createZodDto(findExampleSchema) {}
