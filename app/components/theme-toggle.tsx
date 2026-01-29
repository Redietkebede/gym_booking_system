"use client";

import { useEffect, useState } from "react";

const PUBLIC_KEY = "gbs-theme";
const ADMIN_KEY = "gbs-theme-admin";

type Theme = "light" | "dark";

function getThemeKey(pathname: string) {
  return pathname.startsWith("/admin") ? ADMIN_KEY : PUBLIC_KEY;
}

function applyTheme(theme: Theme, persist = true, key = PUBLIC_KEY) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
  if (persist) {
    localStorage.setItem(key, theme);
    const cookiePath = key === ADMIN_KEY ? "/admin" : "/";
    document.cookie = `${key}=${theme}; Path=${cookiePath}; Max-Age=31536000`;
  }
}

function readCookieTheme(key: string): Theme | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]+)`));
  if (!match) {
    return null;
  }
  const value = match[1];
  return value === "dark" ? "dark" : value === "light" ? "light" : null;
}

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const key = getThemeKey(window.location.pathname);
    const stored = localStorage.getItem(key) as Theme | null;
    const cookieTheme = readCookieTheme(key);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial =
      stored ?? cookieTheme ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial, false, key);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key || !event.newValue) {
        return;
      }
      const next = event.newValue === "dark" ? "dark" : "light";
      setTheme(next);
      applyTheme(next, false, key);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        const key = getThemeKey(window.location.pathname);
        setTheme(nextTheme);
        applyTheme(nextTheme, true, key);
      }}
      className={`btn-ghost btn-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-ember)/30 ${className ?? ""}`}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {nextTheme} mode
    </button>
  );
}
