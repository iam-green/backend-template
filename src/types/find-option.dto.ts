import { z } from 'zod';

export const FindOptionDto = z.object({
  sort: z
    .enum(['asc', 'desc'])
    .nullish()
    .default('asc')
    .transform((v) => v ?? 'asc'),
  page: z
    .number()
    .nullish()
    .default(1)
    .transform((v) => v ?? 1),
  limit: z.number().default(10),
  from: z.coerce
    .date()
    .or(z.coerce.number())
    .nullish()
    .default(new Date(0))
    .transform((v) => new Date(v ?? 0)),
  to: z.coerce
    .date()
    .or(z.coerce.number())
    .nullish()
    .default(() => new Date())
    .transform((v) => new Date(v ?? new Date())),
});
