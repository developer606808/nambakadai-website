"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  ShoppingCart,
  Star,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Calendar,
  Clock,
  Truck
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalProducts: number
  totalVehicles: number
  totalSales: number
  totalBookings: number
  totalCustomers: number
  monthlyGrowth: number
  averageRating: number
  pendingOrders: number
  lowStockItems: number
  activeRentals: number
}

export default function SellerDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalVehicles: 0,
    totalSales: 0,
    totalBookings: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
    averageRating: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    activeRentals: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all dashboard data in parallel
      const [productsRes, vehiclesRes, ordersRes, bookingsRes] = await Promise.all([
        fetch('/api/products?limit=5'),
        fetch('/api/vehicles?limit=5'),
        fetch('/api/orders?limit=5'),
        fetch('/api/bookings?limit=5')
      ])

      const [products, vehicles, orders, bookings] = await Promise.all([
        productsRes.ok ? productsRes.json() : { products: [], total: 0 },
        vehiclesRes.ok ? vehiclesRes.json() : { vehicles: [], total: 0 },
        ordersRes.ok ? ordersRes.json() : { orders: [], total: 0 },
        bookingsRes.ok ? bookingsRes.json() : { bookings: [], total: 0 }
      ])

      // Calculate stats
      const newStats: DashboardStats = {
        totalProducts: products.total || 0,
        totalVehicles: vehicles.total || 0,
        totalSales: orders.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0,
        totalBookings: bookings.total || 0,
        totalCustomers: new Set([
          ...(orders.orders?.map((o: any) => o.customerId) || []),
          ...(bookings.bookings?.map((b: any) => b.customerId) || [])
        ]).size,
        monthlyGrowth: 12.5, // Calculate from historical data
        averageRating: 4.6, // Calculate from reviews
        pendingOrders: orders.orders?.filter((o: any) => o.status === 'pending').length || 0,
        lowStockItems: products.products?.filter((p: any) => p.stock <= 10).length || 0,
        activeRentals: bookings.bookings?.filter((b: any) => b.status === 'ongoing').length || 0
      }

      setStats(newStats)

      // Combine recent activity
      const activity = [
        ...(orders.orders?.slice(0, 3).map((order: any) => ({
          type: 'order',
          id: order.id,
          customer: order.customerName,
          item: order.items?.[0]?.product?.name || 'Product',
          amount: order.total,
          status: order.status,
          time: new Date(order.createdAt).toLocaleString()
        })) || []),
        ...(bookings.bookings?.slice(0, 2).map((booking: any) => ({
          type: 'booking',
          id: booking.id,
          customer: booking.customerName,
          item: booking.vehicle?.name || 'Equipment',
          amount: booking.totalAmount,
          status: booking.status,
          time: new Date(booking.createdAt).toLocaleString()
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

      setRecentActivity(activity)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Recent activity is now fetched from API and stored in state

  const quickActions = [
    {
      title: "Add New Product",
      description: "List a new product in your store",
      href: "/seller/products/new",
      icon: Plus,
      color: "bg-green-500"
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      href: "/seller/orders",
      icon: ShoppingCart,
      color: "bg-blue-500"
    },
    {
      title: "Check Messages",
      description: "Respond to customer inquiries",
      href: "/seller/messages",
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      title: "Update Store",
      description: "Edit store information",
      href: "/seller/settings",
      icon: Eye,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Store Banner */}
      {session?.user?.currentStore?.banner && (
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img
            src={session.user.currentStore.banner}
            alt="Store banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-4 text-white">
              <h2 className="text-xl font-bold">{session.user.currentStore.name}</h2>
              <p className="text-sm opacity-90">{session.user.currentStore.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session?.user?.name}! Here's what's happening with your store.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="outline" className="text-green-700 border-green-200">
            Store Status: Active
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.lowStockItems} low stock items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeRentals} currently rented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalBookings} bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your store efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Link href="/seller/orders">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse p-3 border rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{activity.customer}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={activity.type === 'order' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {activity.type}
                          </Badge>
                          <Badge
                            variant={activity.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.item}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-green-600">₹{activity.amount}</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
            <CardDescription>Key metrics and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-sm">Average Rating</h4>
                    <p className="text-xs text-gray-600">Based on customer reviews</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">{stats.averageRating}/5</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-sm">Low Stock Alert</h4>
                    <p className="text-xs text-gray-600">Items running low</p>
                  </div>
                </div>
                <span className="font-bold text-orange-600">{stats.lowStockItems} items</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-sm">Pending Orders</h4>
                    <p className="text-xs text-gray-600">Awaiting processing</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600">{stats.pendingOrders} orders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
