import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nanbakadai - Farm to Table Classified Ads Marketplace",
  description:
    "Connect directly with local farmers and vendors through classified ads. Buy and sell fresh farm products, organic produce, and agricultural equipment.",
  keywords:
    "farm products, classified ads, organic produce, local farmers, agriculture marketplace, fresh vegetables, fruits",
  authors: [{ name: "Nanbakadai Team" }],
  creator: "Nanbakadai",
  publisher: "Nanbakadai",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nanbakadai.com",
    siteName: "Nanbakadai",
    title: "Nanbakadai - Farm to Table Classified Ads Marketplace",
    description:
      "Connect directly with local farmers and vendors through classified ads. Buy and sell fresh farm products, organic produce, and agricultural equipment.",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "Nanbakadai - Farm to Table Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanbakadai - Farm to Table Classified Ads Marketplace",
    description: "Connect directly with local farmers and vendors through classified ads.",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Suspense>
            <main>{children}</main>
          </Suspense>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
