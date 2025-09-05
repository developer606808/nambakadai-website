// Commented out - next-intl removed from project
// import { notFound } from 'next/navigation';
// import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ta'];
export const defaultLocale = 'en';

// Commented out - next-intl removed from project
// export default getRequestConfig(async ({ requestLocale }) => {
//   // Get locale from request headers set by middleware
//   let locale = await requestLocale;

//   // If no locale from request, default to 'en'
//   if (!locale) {
//     locale = defaultLocale;
//   }

//   // Validate that the incoming `locale` parameter is valid
//   if (!locales.includes(locale as any)) {
//     locale = defaultLocale;
//   }

//   return {
//     messages: (await import(`./messages/${locale}.json`)).default
//   };
// });