import '@mui/material/styles';
import '@mui/material/Button';

declare module '@mui/material/styles' {
  interface Palette {
    bar: Palette['primary'];
    wlc: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }

  interface PaletteOptions {
    bar?: PaletteOptions['primary'];
    wlc: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    brand: true;
    wlc: true;
    gray: true;
  }
}

export {};
