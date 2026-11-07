import { MarketplaceNavbar } from "@/components/marketplace/chrome";
import { Footer } from "@/components/marketplace/footer";
import { MarketplaceProvider } from "@/components/marketplace/provider";
import { MarketplaceShell } from "@/components/marketplace/shell";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  adjustFontFallback: false,
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
    <html lang="en" className={satoshi.variable}>
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
