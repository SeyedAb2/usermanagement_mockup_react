import type { Components, Theme } from '@mui/material/styles';

export const components = (theme: Theme): Components<Omit<Theme, 'components'>> => ({
  MuiButton: {
    // defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { paddingInline: theme.spacing(2) },
    //   containedPrimary: {},
    },
  },
  MuiTextField: {
    // defaultProps: { size: 'small', fullWidth: true },
  },
  MuiPaper: {
    // styleOverrides: { rounded: { borderRadius: 16 } },
  },
  
});
