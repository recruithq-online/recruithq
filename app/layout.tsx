import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rEcruit — Beyond CVs. Built on Reputation",
  description:
    "Find reputable experts using work history and reviews from past hirers — not just a CV.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
          let theme;
          try { theme = localStorage.getItem('recruit-theme'); } catch {}
          document.documentElement.dataset.theme = theme === 'light' || theme === 'dark'
            ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        })();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Retain the source font request without a build-time network dependency. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
