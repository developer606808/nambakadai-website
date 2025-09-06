'use client';

import { useI18n } from '@/lib/i18n-context';

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'ta' as const, name: 'தமிழ்', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, isHydrated } = useI18n();

  const switchLanguage = (langCode: 'en' | 'ta') => {
    setLocale(langCode);
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Language:</span>
        <div className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-gray-100">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Language:</span>
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value as 'en' | 'ta')}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}