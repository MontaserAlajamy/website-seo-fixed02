import type { ThemeSettings } from '../types/theme';

export function generateCssVariables(theme: ThemeSettings): Record<string, string> {
  return {
    '--font-family-heading': theme.fonts.heading.family,
    '--font-weight-heading': theme.fonts.heading.weight.toString(),
    '--font-size-heading': theme.fonts.heading.size,
    '--line-height-heading': theme.fonts.heading.lineHeight,
    '--letter-spacing-heading': theme.fonts.heading.letterSpacing,

    '--font-family-body': theme.fonts.body.family,
    '--font-weight-body': theme.fonts.body.weight.toString(),
    '--font-size-body': theme.fonts.body.size,
    '--line-height-body': theme.fonts.body.lineHeight,
    '--letter-spacing-body': theme.fonts.body.letterSpacing,

    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-text': theme.colors.text,
    '--color-heading': theme.colors.heading,

    '--spacing-container': theme.spacing.container,
    '--spacing-section': theme.spacing.section,
    '--spacing-element': theme.spacing.element,

    '--animation-duration': theme.animations.duration,
    '--animation-easing': theme.animations.easing,
  };
}