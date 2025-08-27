import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define supported locales
const locales = ['en', 'ta'];
const defaultLocale = 'en';

// Function to get locale from cookie or browser preferences
function getLocale(request: NextRequest): string {
  // Check if locale is in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check browser accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLocales = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    for (const lang of browserLocales) {
      if (locales.includes(lang)) {
        return lang;
      }
      // Check for language variants (e.g., 'en-US' should match 'en')
      const primaryLang = lang.split('-')[0];
      if (locales.includes(primaryLang)) {
        return primaryLang;
      }
    }
  }

  // Default to English
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Get locale from cookie or browser preferences
  const locale = getLocale(request);
  
  // Create response
  const response = NextResponse.next();
  
  // Set locale cookie if not already set or if it's different
  const currentLocaleCookie = request.cookies.get('NEXT_LOCALE');
  if (!currentLocaleCookie || currentLocaleCookie.value !== locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      path: '/',
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
    // Re-include root path
    '/',
  ],
};