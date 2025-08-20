import type React from "react"
import Link from "next/link"
import { LogOut, UserCircle, Store } from 'lucide-react'
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/mobile-menu"
import SearchBar from "@/components/search-bar"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="md:hidden">
              <MobileMenu />
            </div>
            <Link href="/" className="flex items-center">
              <div className="h-10 w-32 relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aBt882nZbdTyKgTaeHTCYc1Lih27bD.png"
                  alt="Nanbakadai Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:block mx-4 flex-1 max-w-md">
            <SearchBar />
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">
              Products
            </Link>
            <Link href="/stores" className="text-gray-700 hover:text-green-600 transition-colors">
              Stores
            </Link>
            <Link href="/season" className="text-gray-700 hover:text-green-600 transition-colors">
              Season
            </Link>
            <Link href="/rentals" className="text-gray-700 hover:text-green-600 transition-colors">
              Rentals
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-green-600 transition-colors">
              Community
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* User Profile Avatar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors">
                    <Image src="/placeholder.svg?height=40&width=40" alt="User avatar" fill className="object-cover" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Farmer</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store/dashboard" className="flex items-center cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    <span>Store Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" className="text-gray-700" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            <Button variant="outline" className="hidden md:flex items-center border-green-500 text-green-600" asChild>
              <Link href="/seller/register">Sell</Link>
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-12 w-40 relative">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aBt882nZbdTyKgTaeHTCYc1Lih27bD.png"
                    alt="Nanbakadai Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Nanbakadai connects farmers, consumers, and agricultural enthusiasts in a vibrant marketplace dedicated
                to sustainable farming and community growth.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Marketplace</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-gray-600 hover:text-green-600 transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/stores" className="text-gray-600 hover:text-green-600 transition-colors">
                    Stores
                  </Link>
                </li>
                <li>
                  <Link href="/season" className="text-gray-600 hover:text-green-600 transition-colors">
                    Seasonal Crops
                  </Link>
                </li>
                <li>
                  <Link href="/rentals" className="text-gray-600 hover:text-green-600 transition-colors">
                    Equipment Rentals
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-green-600 transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-600 hover:text-green-600 transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-gray-600 hover:text-green-600 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-600 hover:text-green-600 transition-colors">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/seller/register" className="text-gray-600 hover:text-green-600 transition-colors">
                    Become a Seller
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="text-gray-600 hover:text-green-600 transition-colors">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-green-600 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Nanbakadai. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/terms" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
