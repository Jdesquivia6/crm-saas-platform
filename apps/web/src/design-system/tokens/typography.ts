export const typography = {
  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  displayXl: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
  },
  displayLg: {
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
  },
  h1: {
    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 'clamp(1.5rem, 2.5vw, 2.125rem)',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
  },
  h3: {
    fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  bodyLg: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySm: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },
};
