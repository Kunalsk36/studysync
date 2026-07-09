"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/**
 * Dark mode is the default experience (06-DesignSystem.md §18).
 * Preference is persisted to localStorage and applied via a `.dark`
 * class on <html>, so every page can toggle instantly without a refresh.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // One-time read of a persisted preference on mount — window/localStorage
    // aren't available during SSR, so this can't be a lazy useState initializer.
    const stored = window.localStorage.getItem("studysync-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("studysync-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
