"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Home, ShoppingBag, Store, Calendar, Truck, Info, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <div className="h-8 w-24 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aBt882nZbdTyKgTaeHTCYc1Lih27bD.png"
                alt="Nanbakadai Logo"
                width={96}
                height={32}
                className="object-contain"
              />
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5 mr-3 text-gray-500" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
            <span>Products</span>
          </Link>
          <Link
            href="/stores"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Store className="h-5 w-5 mr-3 text-gray-500" />
            <span>Stores</span>
          </Link>
          <Link
            href="/season"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Calendar className="h-5 w-5 mr-3 text-gray-500" />
            <span>Season</span>
          </Link>
          <Link
            href="/rentals"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Truck className="h-5 w-5 mr-3 text-gray-500" />
            <span>Rentals</span>
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Info className="h-5 w-5 mr-3 text-gray-500" />
            <span>About</span>
          </Link>

          <div className="border-t my-4 pt-4">
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <span>Profile</span>
            </Link>
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogIn className="h-5 w-5 mr-3 text-gray-500" />
              <span>Login</span>
            </Link>
          </div>

          <div className="mt-4">
            <Button className="w-full bg-green-500 hover:bg-green-600">Sign Up</Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
