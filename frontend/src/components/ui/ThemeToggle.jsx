"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--fg)] ${className}`}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
