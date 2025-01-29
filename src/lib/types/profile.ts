import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photo: z.string().url().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  contact: z.object({
    whatsapp: z.string(),
    availableHours: z.string(),
    languages: z.array(z.string()),
  }),
  visibility: z.object({
    showWhatsApp: z.boolean(),
    showAvailability: z.boolean(),
    showLanguages: z.boolean(),
  }),
});

export type ProfileData = z.infer<typeof profileSchema>;