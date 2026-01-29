import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
// @ts-ignore: global CSS import may lack type declarations in some TS setups
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Forge Training",
  description: "Book strength, conditioning, and mobility sessions with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var isAdmin = window.location && window.location.pathname.startsWith("/admin");
        var storageKey = isAdmin ? "gbs-theme-admin" : "gbs-theme";
        var stored = localStorage.getItem(storageKey);
        var cookieMatch = document.cookie.match(new RegExp("(?:^|; )" + storageKey + "=([^;]+)"));
        var cookieTheme = cookieMatch ? cookieMatch[1] : null;
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored || cookieTheme || (prefersDark ? "dark" : "light");
        var root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        root.style.colorScheme = theme;
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
