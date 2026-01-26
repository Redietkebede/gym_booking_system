"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "gbs-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, theme);
}

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }}
      className={`rounded-full border border-(--brand-ink) px-4 py-2 text-xs font-semibold uppercase tracking-widest text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-ember) hover:text-(--brand-ember) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-ember)/30 ${className ?? ""}`}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {nextTheme} mode
    </button>
  );
}
