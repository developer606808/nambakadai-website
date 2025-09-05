'use client';

import { useI18n } from '@/lib/i18n-context';
import LanguageSwitcher from '@/components/language-switcher';

export default function DemoPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('home.title')}
            </h1>
            <LanguageSwitcher />
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                {t('home.subtitle')}
              </h2>
              <p className="text-blue-700">
                {t('home.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">{t('nav.home')}</h3>
                <p className="text-green-700 text-sm">{t('common.loading')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">{t('nav.products')}</h3>
                <p className="text-purple-700 text-sm">{t('common.search')}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">{t('nav.stores')}</h3>
                <p className="text-orange-700 text-sm">{t('common.filter')}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Translation Demo</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Loading:</strong> {t('common.loading')}</p>
                <p><strong>Search:</strong> {t('common.search')}</p>
                <p><strong>Filter:</strong> {t('common.filter')}</p>
                <p><strong>Success:</strong> {t('common.success')}</p>
                <p><strong>Error:</strong> {t('common.error')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}