import { createTheme } from '@mui/material/styles';
import { colors } from './design-system/tokens/colors';
import { typography } from './design-system/tokens/typography';
import { radius } from './design-system/tokens/radius';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
    },
    secondary: {
      main: colors.primary[400],
      light: colors.primary[200],
      dark: colors.primary[700],
    },
    background: {
      default: colors.background.soft,
      paper: colors.surface.default,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.success.main,
    },
    warning: {
      main: colors.warning.main,
    },
    error: {
      main: colors.danger.main,
    },
    info: {
      main: colors.info.main,
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
  },
  shape: {
    borderRadius: parseInt(radius.md),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typography.fontFamily,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: radius.sm,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.xs,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
