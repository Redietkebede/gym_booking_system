import { z } from "zod";

const MIN_RATING = 1;
const MAX_RATING = 5;
const DEFAULT_RATING = 5;

export const testimonialSchema = z.object({
  name: z.string().catch("").transform((value) => value.trim()),
  rating: z
    .number()
    .finite()
    .catch(DEFAULT_RATING)
    .transform((value) =>
      Math.min(Math.max(Math.round(value), MIN_RATING), MAX_RATING),
    ),
  quote: z.string().catch("").transform((value) => value.trim()),
});

export const testimonialsJsonSchema = z
  .array(z.unknown())
  .transform((entries) =>
    entries.flatMap((entry) => {
      const parsed = testimonialSchema.safeParse(entry);
      return parsed.success ? [parsed.data] : [];
    }),
  );

export type ParsedTestimonial = z.infer<typeof testimonialSchema>;
