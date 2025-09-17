import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UIState , Mode } from '../shared/types/ui-store.type';


const getSystemPref = (): Mode =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      themeMode: getSystemPref(),
      setTheme: (m) => set({ themeMode: m }),
      toggleTheme: () => set({ themeMode: get().themeMode === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
);
