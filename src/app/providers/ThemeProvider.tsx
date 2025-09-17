import { PropsWithChildren, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useUIStore } from '../../store/ui.store';
import { buildTheme } from '../../shared/theme';

export default function ThemeProvider({ children }: PropsWithChildren) {
  const mode = useUIStore((s) => s.themeMode);
  const theme = useMemo(() => buildTheme(mode), [mode]);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
