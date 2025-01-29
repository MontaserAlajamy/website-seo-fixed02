import { z } from 'zod';

export const settingsSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  aboutText: z.string(),
  profileImage: z.string().url().optional(),
  contactEmail: z.string().email(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
  })),
});

export type SiteSettings = z.infer<typeof settingsSchema>;