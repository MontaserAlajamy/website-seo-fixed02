import { z } from 'zod';

export const adminSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  thumbnail: string;
  featured?: boolean;
  tags?: string[];
  type: 'video' | 'photo';
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  contact: {
    email: string;
    phone: string;
    location?: string;
  };
}

// Admin related types
export interface AdminSettings {
  password: string;
}