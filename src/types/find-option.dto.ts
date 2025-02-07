import { z } from 'zod';

export const FindOptionDto = z.object({
  sort: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().default(1),
  limit: z.number().default(10),
  from: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v))
    .default(new Date(0)),
  to: z.coerce
    .date()
    .or(z.coerce.number())
    .transform((v) => new Date(v))
    .default(() => new Date()),
});
