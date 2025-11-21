import { z } from 'zod';

// L4 Contract: Строгая валидация полей
export const RitualSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  motivation: z.string().min(5),
  task: z.string().min(3),
  affirmation: z.string().min(3),
  imagePrompt: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type Ritual = z.infer<typeof RitualSchema>;
