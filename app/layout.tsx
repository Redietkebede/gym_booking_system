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
  title: "Gym Booking System",
  description: "Book strength, conditioning, and mobility sessions with ease.",
  icons: {
    icon: "/assets/brand/favicon-light.svg",
    shortcut: "/assets/brand/favicon-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var setFavicon = function(theme) {
          var baseHref =
            theme === "dark"
              ? "/assets/brand/favicon-dark.svg"
              : "/assets/brand/favicon-light.svg";
          var href = baseHref + "?theme=" + theme;
          var links = Array.prototype.slice.call(
            document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']")
          );

          if (!links.length) {
            var icon = document.createElement("link");
            icon.setAttribute("rel", "icon");
            icon.setAttribute("type", "image/svg+xml");
            icon.setAttribute("href", href);
            document.head.appendChild(icon);

            var shortcut = document.createElement("link");
            shortcut.setAttribute("rel", "shortcut icon");
            shortcut.setAttribute("type", "image/svg+xml");
            shortcut.setAttribute("href", href);
            document.head.appendChild(shortcut);
            return;
          }

          links.forEach(function(link) {
            link.setAttribute("href", href);
            link.setAttribute("type", "image/svg+xml");
            link.removeAttribute("media");
          });
        };

        var publicKey = "gbs-theme";
        var adminLegacyKey = "gbs-theme-admin";
        var readCookie = function(key) {
          var match = document.cookie.match(new RegExp("(?:^|; )" + key + "=([^;]+)"));
          return match ? match[1] : null;
        };
        var stored = localStorage.getItem(publicKey) || localStorage.getItem(adminLegacyKey);
        var cookieTheme = readCookie(publicKey) || readCookie(adminLegacyKey);
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored || cookieTheme || (prefersDark ? "dark" : "light");
        var root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        root.style.colorScheme = theme;
        localStorage.setItem(publicKey, theme);
        document.cookie = publicKey + "=" + theme + "; Path=/; Max-Age=31536000; SameSite=Lax";
        setFavicon(theme);
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
