"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  ShoppingBasket,
  Users,
  Store,
  Car,
  Tag,
  Ruler,
  MapPin,
  Building,
  Settings,
  FileText,
  Bell,
  Mail,
  CreditCard,
  BarChart3,
  Shield,
  LogOut,
  ChevronLeft,
  ImageIcon,
} from "lucide-react"

interface AdminSidebarProps {
  collapsed?: boolean
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <ShoppingBasket className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Stores",
      href: "/admin/stores",
      icon: <Store className="h-5 w-5" />,
    },
    {
      title: "Rentals",
      href: "/admin/rentals",
      icon: <Car className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Units",
      href: "/admin/units",
      icon: <Ruler className="h-5 w-5" />,
    },
    {
      title: "Banners",
      href: "/admin/banners",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: "States",
      href: "/admin/states",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Cities",
      href: "/admin/cities",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Roles",
      href: "/admin/roles",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname.startsWith("/admin/settings"),
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Change Password",
      href: "/admin/change-password",
      icon: <Shield className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    // Remove admin token
    localStorage.removeItem("adminToken")
    // Redirect to login page
    router.push("/admin/login")
  }

  return (
    <div className={cn("flex flex-col border-r bg-background h-screen", collapsed ? "w-[70px]" : "w-[240px]")}>
      <div className="py-4 px-3 border-b flex items-center justify-center">
        {collapsed ? (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route, i) => (
            <Link
              key={i}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                (pathname === route.href || route.active) && "bg-accent text-accent-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              {route.icon}
              {!collapsed && <span>{route.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("w-full", collapsed && "px-2")}
          onClick={() => router.push("/")}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Site
            </span>
          )}
        </Button>

        <Button variant="destructive" size="sm" className={cn("w-full", collapsed && "px-2")} onClick={handleLogout}>
          {collapsed ? (
            <LogOut className="h-4 w-4" />
          ) : (
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
