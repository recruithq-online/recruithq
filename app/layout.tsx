import { MarketplaceNavbar } from "@/components/marketplace/chrome";
import { Footer } from "@/components/marketplace/footer";
import { MarketplaceProvider } from "@/components/marketplace/provider";
import { MarketplaceShell } from "@/components/marketplace/shell";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: "./fonts/dm-sans.ttf",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 1000",
});

export const metadata: Metadata = {
  title: "rEcruit — Beyond CVs. Built on Reputation",
  description:
    "Discover independent experts through demonstrated work, professional vouches, and accountable reputation. Beyond CVs. Built on Reputation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
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
      </head>
      <body>
        <MarketplaceProvider>
          <MarketplaceNavbar />
          <MarketplaceShell>{children}</MarketplaceShell>
          <Footer />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
