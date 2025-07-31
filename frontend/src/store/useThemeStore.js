import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("linguify_theme") || "coffee",

  setTheme:(theme) => {
    localStorage.setItem("linguify_theme", theme);
    set({ theme });
  }
}));