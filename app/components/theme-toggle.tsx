"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "gbs-theme";
const LEGACY_ADMIN_KEY = "gbs-theme-admin";

type Theme = "light" | "dark";

function applyFavicon(theme: Theme) {
  const baseHref =
    theme === "dark"
      ? "/assets/brand/favicon-dark.svg"
      : "/assets/brand/favicon-light.svg";
  const href = `${baseHref}?theme=${theme}`;
  const links = Array.from(
    document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']"),
  ) as HTMLLinkElement[];

  if (!links.length) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = href;
    icon.type = "image/svg+xml";
    document.head.appendChild(icon);

    const shortcut = document.createElement("link");
    shortcut.rel = "shortcut icon";
    shortcut.href = href;
    shortcut.type = "image/svg+xml";
    document.head.appendChild(shortcut);
    return;
  }

  links.forEach((link) => {
    link.href = href;
    link.type = "image/svg+xml";
    link.removeAttribute("media");
  });
}

function applyTheme(theme: Theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
  applyFavicon(theme);
  if (persist) {
    localStorage.setItem(THEME_KEY, theme);
    // Keep legacy key in sync so existing admin sessions do not bounce theme.
    localStorage.setItem(LEGACY_ADMIN_KEY, theme);
    document.cookie = `${THEME_KEY}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.cookie = `${LEGACY_ADMIN_KEY}=${theme}; Path=/admin; Max-Age=31536000; SameSite=Lax`;
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
    const stored = (localStorage.getItem(THEME_KEY) ??
      localStorage.getItem(LEGACY_ADMIN_KEY)) as Theme | null;
    const cookieTheme =
      readCookieTheme(THEME_KEY) ?? readCookieTheme(LEGACY_ADMIN_KEY);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial =
      stored ?? cookieTheme ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial, false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY || !event.newValue) {
        return;
      }
      const next = event.newValue === "dark" ? "dark" : "light";
      setTheme(next);
      applyTheme(next, false);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme, true);
      }}
      className={`btn-ghost btn-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-ember)/30 ${className ?? ""}`}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {nextTheme} mode
    </button>
  );
}
