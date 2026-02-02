import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: typeof window !== "undefined" 
        ? window.matchMedia("(prefers-color-scheme: dark)").matches 
        : false,

      toggleTheme: () => {
        const newIsDark = !get().isDark;
        set({ isDark: newIsDark });
        applyTheme(newIsDark);
      },

      setTheme: (isDark: boolean) => {
        set({ isDark });
        applyTheme(isDark);
      },
    }),
    {
      name: "shopwise-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.isDark);
        }
      },
    }
  )
);

function applyTheme(isDark: boolean) {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}
