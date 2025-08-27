import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// You can get the locales from a database or a config file
export const locales = ['en', 'ta'];

export default getRequestConfig(async () => {
  // Get locale from headers (set by middleware)
  const headersList = headers();
  const locale = headersList.get('x-locale') || 'en';
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});