import { FindOptionDto, findOptionSchema } from 'src/types';
import { ExampleDto, exampleSchema } from './example.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export const findExampleSchema = exampleSchema.partial().and(findOptionSchema);

export class FindExampleDto extends IntersectionType(
  PartialType(ExampleDto),
  FindOptionDto,
) {}
