import { z } from 'zod';

export const videoSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string(),
  vimeoId: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  createdAt: z.date().optional(),
  thumbnail: z.string().url(),
});

export type Video = z.infer<typeof videoSchema>;

export const INITIAL_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Corporate Overview',
    vimeoId: '1041822199',
    description: 'Professional corporate video showcasing company values',
    category: 'Television Productions',
    thumbnail: 'https://vumbnail.com/1041822199.jpg',
    tags: ['corporate', 'business'],
    order: 1,
  },
  // Add other videos similarly
];