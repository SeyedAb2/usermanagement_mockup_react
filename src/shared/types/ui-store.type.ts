export type Mode = 'light' | 'dark';

export type UIState = {
  themeMode: Mode;
  setTheme: (m: Mode) => void;
  toggleTheme: () => void;
};