import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components as componentsFactory } from './components';

export type AppThemeMode = 'light' | 'dark';

const baseOptions: ThemeOptions = {
  typography,
};

export const buildTheme = (mode: AppThemeMode, overrides?: ThemeOptions) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  const withPalette = createTheme(deepmerge(baseOptions, { palette }));
  withPalette.components = deepmerge(withPalette.components ?? {}, componentsFactory(withPalette));
  const finalTheme = createTheme(deepmerge(withPalette, overrides ?? {}));
  return responsiveFontSizes(finalTheme);
};
