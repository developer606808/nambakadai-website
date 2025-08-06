"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, Heart, User, Menu, Sun, Moon, Bell, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuthRedux } from "@/hooks/use-auth-redux"
import { useAppSelector } from "@/lib/hooks"
import MobileMenu from "@/components/mobile-menu"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { isAuthenticated, user } = useAuthRedux()
  const pathname = usePathname()

  // Mock cart and wishlist counts
  const cartCount = 3
  const wishlistCount = 5
  const notificationCount = 2

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/stores", label: "Stores" },
    { href: "/rentals", label: "Rentals" },
    { href: "/season", label: "Seasonal" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl text-green-600">Nanbakadai</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-green-600 ${
                    pathname === link.href ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products, stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green-500">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products, stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)}
        navigationLinks={navigationLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-bold text-xl text-green-600">Nanbakadai</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connecting farmers and consumers through sustainable agriculture and fresh, local produce.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-muted-foreground hover:text-foreground">Products</Link></li>
                <li><Link href="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
                <li><Link href="/stores" className="text-muted-foreground hover:text-foreground">Stores</Link></li>
                <li><Link href="/rentals" className="text-muted-foreground hover:text-foreground">Equipment Rentals</Link></li>
                <li><Link href="/season" className="text-muted-foreground hover:text-foreground">Seasonal Guide</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Info</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@nanbakadai.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Nanbakadai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
