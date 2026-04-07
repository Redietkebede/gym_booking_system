"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

type ResolvedTheme = "light" | "dark";

function applyFavicon(theme: ResolvedTheme) {
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

export default function FaviconSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") {
      return;
    }

    document.documentElement.style.colorScheme = resolvedTheme;
    applyFavicon(resolvedTheme);
  }, [resolvedTheme]);

  return null;
}
