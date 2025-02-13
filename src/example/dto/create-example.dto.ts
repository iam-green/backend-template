import { ExampleDto, exampleSchema } from './example.dto';
import { OmitType } from '@nestjs/swagger';

export const createExampleSchema = exampleSchema.omit({
  id: true,
  created: true,
});

export class CreateExampleDto extends OmitType(ExampleDto, [
  'id',
  'created',
] as const) {}
