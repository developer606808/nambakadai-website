import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { NextAuthProvider } from "@/components/providers/session-provider"
import { Suspense } from "react"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
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
  // Get locale from cookie
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  
  // Validate that the locale is valid
  const locales = ['en', 'ta'];
  if (!locales.includes(locale)) {
    locale = 'en';
  }
  
  // Get the messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
              storageKey="nambakadai-theme"
            >
              <NextIntlClientProvider locale={locale} messages={messages}>
                <Suspense>
                  <main>{children}</main>
                </Suspense>
              </NextIntlClientProvider>
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}