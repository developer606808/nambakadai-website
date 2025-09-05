import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { NextAuthProvider } from "@/components/providers/session-provider"
import { I18nProvider } from "@/lib/i18n-context"
import { Suspense } from "react"
import { cookies } from 'next/headers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nanbakadai - Farm to Table Classified Ads Marketplace",
  description:
    "Connect directly with local farmers and vendors through classified ads. Buy and sell fresh farm products, organic produce, and agricultural equipment.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get locale from cookie for HTML lang attribute
  const cookieStore = await cookies();
  let locale = cookieStore.get('APP_LOCALE')?.value || 'en';

  // Validate that the locale is valid
  const supportedLocales = ['en', 'ta'];
  if (!supportedLocales.includes(locale)) {
    locale = 'en';
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Favicon for all devices and screen sizes */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="theme-color" content="#10b981" />

        {/* Android Chrome icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon_io/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon_io/android-chrome-512x512.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextAuthProvider>
          <ReduxProvider>
            <I18nProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
                storageKey="nambakadai-theme"
              >
                <Suspense>
                  <main>{children}</main>
                </Suspense>
              </ThemeProvider>
            </I18nProvider>
          </ReduxProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}