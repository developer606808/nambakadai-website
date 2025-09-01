'use client';

<<<<<<< Updated upstream
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
<<<<<<< Updated upstream
import { LanguageSwitcher } from '@/components/language-switcher';
=======
import Image from 'next/image';
import { Menu, X, Home, Grid3X3, Package, Store, Users, Heart } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserAvatarDropdown } from '@/components/layout/user-avatar-dropdown';
import { useWishlist } from '@/hooks/useWishlist';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useFirebase } from '@/hooks/useFirebase';
import enMessages from '../messages/en.json';
import taMessages from '../messages/ta.json';
>>>>>>> Stashed changes

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { wishlistCount } = useWishlist();
  const { unreadCount: messageCount } = useUnreadMessages();
  const { notification } = useFirebase();

<<<<<<< Updated upstream
  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/categories', label: t('categories'), icon: Grid3X3 },
    { href: '/products', label: t('products'), icon: Package },
    { href: '/stores', label: t('stores'), icon: Store },
    { href: '/community', label: t('community'), icon: Users },
    { href: '/wishlist', label: t('wishlist'), icon: Heart },
  ];

=======
  // Get current locale from cookie (client-side)
  const [currentLocale, setCurrentLocale] = useState('en');

  // Get messages based on current locale
  const messages = currentLocale === 'ta' ? taMessages : enMessages;
  const t = (key: string) => (messages.Navigation as any)[key] || key;

  // Base navigation items (always shown)
  const baseNavItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/categories', label: t('categories'), icon: Grid3X3 },
    { href: '/products', label: t('products'), icon: Package },
    { href: '/stores', label: t('stores'), icon: Store },
    { href: '/demand', label: t('demand'), icon: Package },
    { href: '/offers', label: t('offers'), icon: Package },
  ];

  // Community items (only shown when logged in)
  const authenticatedNavItems = session?.user ? [
    { href: '/community', label: t('community'), icon: Users },
  ] : [];

  // Combine navigation items
  const navItems = [...baseNavItems, ...authenticatedNavItems];

  // Get locale from cookie on client side
  useEffect(() => {
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en';

    if (locale === 'en' || locale === 'ta') {
      setCurrentLocale(locale);
    }
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
<<<<<<< Updated upstream
            <Link href="/" className="text-2xl font-bold text-primary">
              Nambakadai
=======
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Nambakadai Logo"
                width={40}
                height={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="text-xl sm:text-2xl font-bold text-primary">
                Nambakadai
              </span>
>>>>>>> Stashed changes
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
<<<<<<< Updated upstream
              
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
=======
            </div>

            {/* Desktop Auth & Language */}
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageSwitcher />
              {session?.user && (
                <div className="flex items-center space-x-2">
                  {/* Wishlist Icon with Count */}
                  <Link href="/wishlist" className="relative p-2 hover:bg-muted rounded-full transition-colors">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Notification Icon with Count */}
                  <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 0110.293-4.293L15 9v8z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* Message Icon with Count */}
                  <Link href="/messages" className="relative p-2 hover:bg-muted rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {messageCount > 99 ? '99+' : messageCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}
              <UserAvatarDropdown />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3">
                        <Image
                          src="/logo.png"
                          alt="Nambakadai Logo"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                        />
                        <span className="text-xl font-bold text-primary">
                          Nambakadai
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Navigation */}
                  <nav className="mt-8 flex flex-col space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                            pathname === item.href
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Mobile Auth Section */}
                    <div className="border-t border-border mt-6 pt-6 space-y-3">
                      <div className="px-4">
                        <LanguageSwitcher />
                      </div>
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center py-3 px-4 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <span>{t('login')}</span>
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMobileMenu}
                        className="mx-4 bg-primary text-primary-foreground px-4 py-3 rounded-lg text-center font-medium hover:bg-primary/90 transition-colors block"
                      >
                        {t('signup')}
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
<<<<<<< Updated upstream
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nambakadai</h3>
              <p className="text-muted-foreground">
                Your trusted marketplace for agricultural products.
=======
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="Nambakadai Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
                <h3 className="text-lg font-semibold">Nambakadai</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your trusted marketplace for agricultural products. Connecting farmers directly with consumers.
>>>>>>> Stashed changes
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/seller/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Become a Seller</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Facebook</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nambakadai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}