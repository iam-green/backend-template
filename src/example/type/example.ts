import { example } from '../example.schema';
import { FindOptionDto } from '../../types/find-option.dto';

export type ExampleDto = typeof example.$inferSelect;

export type CreateExampleDto = Omit<ExampleDto, 'id' | 'created'>;

export type UpdateExampleDto = Partial<CreateExampleDto>;

export type FindExampleDto = FindOptionDto & Partial<ExampleDto>;
