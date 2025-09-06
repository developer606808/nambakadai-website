'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { MainLayout } from '@/components/main-layout';
import { motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MainLayout>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </MainLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}