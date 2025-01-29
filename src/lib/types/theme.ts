import { z } from 'zod';

export const fontSchema = z.object({
  family: z.string(),
  weight: z.number(),
  size: z.string(),
  lineHeight: z.string(),
  letterSpacing: z.string(),
});

export const colorSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  heading: z.string(),
});

export const themeSchema = z.object({
  fonts: z.object({
    heading: fontSchema,
    body: fontSchema,
    accent: fontSchema,
  }),
  colors: colorSchema,
  spacing: z.object({
    container: z.string(),
    section: z.string(),
    element: z.string(),
  }),
  animations: z.object({
    duration: z.string(),
    easing: z.string(),
  }),
});

export type ThemeSettings = z.infer<typeof themeSchema>;