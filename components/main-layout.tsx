'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/categories', label: t('categories') },
    { href: '/products', label: t('products') },
    { href: '/stores', label: t('stores') },
    { href: '/community', label: t('community') },
    { href: '/wishlist', label: t('wishlist') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              Nambakadai
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-foreground hover:text-primary transition-colors ${
                    pathname === item.href ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nambakadai</h3>
              <p className="text-muted-foreground">
                Your trusted marketplace for agricultural products.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Facebook</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Nambakadai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}