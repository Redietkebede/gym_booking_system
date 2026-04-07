"use client";

import { useTheme } from "next-themes";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={`btn-ghost btn-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-ember)/30 ${className ?? ""}`}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {`${nextTheme} mode`}
    </button>
  );
}
