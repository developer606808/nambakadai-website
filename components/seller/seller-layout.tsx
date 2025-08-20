"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAppDispatch } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { selectUser } from "@/lib/features/auth/authSlice"
import { useAppSelector } from "@/lib/hooks"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center py-2 px-3 rounded-md ${
        active ? "bg-green-50 text-green-600" : "hover:bg-gray-100"
      }`}
    >
      <div className="mr-3 text-gray-500">{icon}</div>
      <span>{label}</span>
    </Link>
  )
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login"); // Redirect to login page after logout
  };

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/seller/dashboard",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Products",
      href: "/seller/products",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
      href: "/seller/orders",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Customers",
      href: "/seller/customers",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: "Analytics",
      href: "/seller/analytics",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/seller/settings",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link href="/" className="flex items-center">
                      <div className="h-8 w-24 relative">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aBt882nZbdTyKgTaeHTCYc1Lih27bD.png"
                          alt="Nanbakadai Logo"
                          width={96}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-4 px-3">
                    <nav className="space-y-1">
                      {sidebarItems.map((item) => (
                        <SidebarItem
                          key={item.href}
                          icon={item.icon}
                          label={item.label}
                          href={item.href}
                          active={pathname === item.href}
                        />
                      ))}
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center ml-2 md:ml-0">
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

          <div className="flex items-center">
            <div className="relative group">
              <Button variant="ghost" className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.name?.charAt(0) || "S"}
                </div>
                <span className="hidden md:block">{user?.name || "Seller"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border overflow-hidden z-10 hidden group-hover:block">
                <div className="py-1">
                  <Link href="/seller/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Store
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 bg-white border-r h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={pathname === item.href}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}