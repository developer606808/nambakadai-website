'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState('en');

  // Get current locale from cookie
  useEffect(() => {
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en';

    if (locale === 'en' || locale === 'ta') {
      setCurrentLocale(locale);
    }
  }, []);

  const handleLocaleChange = (locale: string) => {
    // Set the locale cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Refresh the page to apply the new locale
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLocaleChange('en')}
        disabled={currentLocale === 'en' || isPending}
        className={`px-3 py-1 text-sm rounded ${
          currentLocale === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLocaleChange('ta')}
        disabled={currentLocale === 'ta' || isPending}
        className={`px-3 py-1 text-sm rounded ${
          currentLocale === 'ta' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
}