'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Loader2 } from 'lucide-react';

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

    // Update local state immediately for better UX
    setCurrentLocale(locale);

    // Refresh the page to apply the new locale
    startTransition(() => {
      router.refresh();
    });
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative">
      <Select value={currentLocale} onValueChange={handleLocaleChange} disabled={isPending}>
        <SelectTrigger className="w-[140px] h-11 bg-gradient-to-r from-white to-green-50 border-2 border-green-200 hover:border-green-400 focus:border-green-500 hover:shadow-lg transition-all duration-300 rounded-2xl group relative overflow-hidden language-trigger-enhanced">
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 language-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex items-center gap-2.5">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            ) : (
              <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-sm">
                <Languages className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-base">{currentLanguage.flag}</span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                  {currentLanguage.name}
                </span>
              </div>
            </SelectValue>
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </SelectTrigger>

        <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-green-200 shadow-2xl rounded-2xl mt-3 p-2 min-w-[160px]">
          {languages.map((language, index) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 cursor-pointer transition-all duration-200 rounded-xl mx-1 my-1 p-3"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg drop-shadow-sm">{language.flag}</span>
                <span className="font-semibold text-gray-800 flex-1">{language.name}</span>
                {currentLocale === language.code && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600">Active</span>
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}