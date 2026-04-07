import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import FaviconSync from "./components/favicon-sync";
import ThemeProvider from "./components/theme-provider";

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
    icon: [
      {
        url: "/assets/brand/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/brand/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/assets/brand/favicon-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}>
        <ThemeProvider>
          <FaviconSync />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
