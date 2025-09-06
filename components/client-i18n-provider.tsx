'use client';

import { I18nProvider } from '@/lib/i18n-context';
import { ReactNode } from 'react';

interface ClientI18nProviderProps {
  children: ReactNode;
}

export function ClientI18nProvider({ children }: ClientI18nProviderProps) {
  return <I18nProvider>{children}</I18nProvider>;
}