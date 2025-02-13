import { CreateExampleDto, createExampleSchema } from './create-example.dto';
import { PartialType } from '@nestjs/swagger';

export const updateExampleSchema = createExampleSchema.partial();

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
