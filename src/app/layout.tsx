import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-mc-body",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-mc-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAHADEV CUTLERY & GIFT ARTICLES — Theme Studio & Preview",
  description:
    "Design preview and delivery studio for the MAHADEV CUTLERY & GIFT ARTICLES Shopify theme. Browse a clearly-labeled SAMPLE storefront, try the Gift Finder and download the theme ZIP plus product import templates. Demo data only — the live store opens after the owner imports real products into Shopify.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSerifDisplay.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
