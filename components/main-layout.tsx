'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Home, Grid3X3, Package, Store, Users, Heart, MessageCircle, Bell, Languages } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserAvatarDropdown } from '@/components/layout/user-avatar-dropdown';
import { useWishlist } from '@/hooks/useWishlist';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import enMessages from '../messages/en.json';
import taMessages from '../messages/ta.json';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { wishlistCount } = useWishlist();
  const { unreadCount: messageCount } = useUnreadMessages();

  // Get current locale from cookie (client-side)
  const [currentLocale, setCurrentLocale] = useState('en');

  // Get messages based on current locale
  const messages = currentLocale === 'ta' ? taMessages : enMessages;
  const t = (key: string) => (messages.Navigation as any)[key] || key;

  // Simplified navigation items
  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/products', label: t('products'), icon: Package },
    { href: '/stores', label: t('stores'), icon: Store },
    { href: '/categories', label: t('categories'), icon: Grid3X3 },
  ];

  // Add community only if user is logged in
  if (session?.user) {
    navItems.push({ href: '/community', label: t('community'), icon: Users });
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Nambakadai Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.currentTarget as HTMLImageElement;
                    const fallback = target.nextElementSibling as HTMLDivElement;
                    if (target && fallback) {
                      target.style.display = 'none';
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden h-10 w-10 bg-green-600 rounded-lg items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Nambakadai</span>
                <p className="text-xs text-gray-600">Fresh • Local • Direct</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />

              {session?.user && (
                <div className="flex items-center space-x-2">
                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'text-red-500' : 'text-gray-600'}`} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link
                    href="/messages"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MessageCircle className={`h-5 w-5 ${messageCount > 0 ? 'text-blue-500' : 'text-gray-600'}`} />
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {messageCount > 99 ? '99+' : messageCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* User Menu */}
              <UserAvatarDropdown />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                        <Image
                          src="/logo.png"
                          alt="Nambakadai Logo"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                        />
                        <span className="text-lg font-bold">Nambakadai</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col space-y-2 mt-6">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}

                    <div className="border-t pt-4 mt-4">
                      <div className="px-4 mb-4">
                        <LanguageSwitcher />
                      </div>

                      {session?.user ? (
                        <div className="space-y-2">
                          <Link
                            href="/wishlist"
                            onClick={closeMobileMenu}
                            className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            <Heart className="h-5 w-5 mr-3" />
                            Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {wishlistCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/messages"
                            onClick={closeMobileMenu}
                            className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            <MessageCircle className="h-5 w-5 mr-3" />
                            Messages
                            {messageCount > 0 && (
                              <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {messageCount}
                              </span>
                            )}
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            href="/login"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 border-t border-green-100 mt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 footer-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-15 footer-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300 rounded-full opacity-10 footer-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-green-400 rounded-full opacity-25 footer-float" style={{animationDelay: '3s'}}></div>

        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Nambakadai Logo"
                    width={56}
                    height={56}
                    className="h-14 w-14 transition-transform group-hover:scale-110"
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Nambakadai
                  </h3>
                  <p className="text-sm text-green-600 font-medium">Fresh • Local • Direct</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm">
                Your trusted marketplace connecting farmers directly with consumers.
                Fresh produce, authentic quality, and sustainable agriculture.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>support@nambakadai.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 relative">
                  Quick Links
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                </h4>
                <ul className="space-y-3">
                  {[
                    { href: '/products', label: 'All Products' },
                    { href: '/categories', label: 'Categories' },
                    { href: '/stores', label: 'Stores' },
                    { href: '/demand', label: 'Demand Board' },
                    { href: '/offers', label: 'Special Offers' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-green-600 transition-all duration-200 text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services & Support */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 relative">
                  Services
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                </h4>
                <ul className="space-y-3">
                  {[
                    { href: '/seller/register', label: 'Become a Seller' },
                    { href: '/community', label: 'Community' },
                    { href: '/about', label: 'About Us' },
                    { href: '/contact', label: 'Contact Us' },
                    { href: '/faq', label: 'Help & FAQ' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-green-600 transition-all duration-200 text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social & Newsletter */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 relative">
                  Connect With Us
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                </h4>

                {/* Social Media Icons */}
                <div className="flex flex-wrap gap-3 mb-6 footer-social-scroll">
                  {[
                    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'hover:text-blue-600' },
                    { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', color: 'hover:text-sky-500' },
                    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: 'hover:text-pink-600' },
                    { name: 'WhatsApp', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488', color: 'hover:text-green-600' },
                    { name: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color: 'hover:text-red-600' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className={`w-12 h-12 bg-white rounded-full shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group footer-glow ${social.color.split(':')[1]}`}
                      aria-label={social.name}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 group-hover:text-current transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h5 className="font-semibold text-gray-900 text-sm">Stay Updated</h5>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Get fresh deals and farming tips</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-md hover:scale-105 transform">
                      Join
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    No spam, unsubscribe anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-green-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">©</span>
                  {new Date().getFullYear()} Nambakadai. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/terms" className="hover:text-green-600 transition-colors">
                    Terms
                  </Link>
                  <span className="text-green-300">•</span>
                  <Link href="/privacy" className="hover:text-green-600 transition-colors">
                    Privacy
                  </Link>
                  <span className="text-green-300">•</span>
                  <Link href="/cookies" className="hover:text-green-600 transition-colors">
                    Cookies
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Made with</span>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>for farmers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}