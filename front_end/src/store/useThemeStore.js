import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme : localStorage.getItem("Lanlern-theme") || "dark",
  setTheme : (theme) => {
      localStorage.setItem("Lanlern-theme",theme);
      set({theme})
  },
}))