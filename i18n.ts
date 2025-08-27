import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// You can get the locales from a database or a config file
export const locales = ['en', 'ta'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  // Get locale from cookie
  const cookieStore = cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  
  // Validate that the locale is valid
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});