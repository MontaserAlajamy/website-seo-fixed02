import { z } from 'zod';

export const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  format: z.enum(['jpeg', 'png', 'webp']),
  sizes: z.array(z.object({
    width: z.number(),
    height: z.number(),
    url: z.string().url(),
  })),
  metadata: z.object({
    caption: z.string().optional(),
    credit: z.string().optional(),
    focalPoint: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
  }).optional(),
});

export type ImageData = z.infer<typeof imageSchema>;