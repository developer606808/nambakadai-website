"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
  Truck,
  Activity,
  Target,
  Award,
  Zap
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Store Banner */}
        {session?.user?.currentStore?.banner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-40 sm:h-48 lg:h-56 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={session.user.currentStore.banner}
              alt="Store banner"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{session.user.currentStore.name}</h2>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed">{session.user.currentStore.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Dashboard
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Welcome back, <span className="font-semibold text-green-700">{session?.user?.name}</span>!
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 px-4 py-2 text-sm font-medium shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Store Status: Active
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-white border-2 border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-3xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-green-800">Products</CardTitle>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-green-700 mb-2">{stats.totalProducts}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-600 font-medium">
                      {stats.lowStockItems} low stock items
                    </p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-3xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-800">Equipment</CardTitle>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-blue-700 mb-2">{stats.totalVehicles}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600 font-medium">
                      {stats.activeRentals} currently rented
                    </p>
                    <div className="flex items-center text-blue-600">
                      <Activity className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-3xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-emerald-800">Revenue</CardTitle>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-emerald-700 mb-2">₹{stats.totalSales.toLocaleString()}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-emerald-600 font-medium">
                      From {stats.totalBookings} bookings
                    </p>
                    <div className="flex items-center text-emerald-600">
                      <Target className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">+{stats.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-3xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-800">Customers</CardTitle>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-purple-700 mb-2">{stats.totalCustomers}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-purple-600 font-medium">
                      {stats.pendingOrders} pending orders
                    </p>
                    <div className="flex items-center text-purple-600">
                      <Award className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">Loyal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Common tasks to manage your store efficiently
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={action.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={action.href}>
                        <div className="group p-5 border-2 border-gray-100 rounded-xl hover:border-green-300 bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-emerald-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:scale-110 transition-all duration-300" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 text-sm group-hover:text-green-800 transition-colors duration-200">
                              {action.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                              {action.description}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-xs font-medium">Get started</span>
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          {/* Recent Orders */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Recent Orders</CardTitle>
                    <CardDescription className="text-gray-600">Latest customer orders</CardDescription>
                  </div>
                </div>
                <Link href="/seller/orders">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="animate-pulse p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No recent activity</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Your recent orders and bookings will appear here</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={`${activity.type}-${activity.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 2 }}
                      className="group p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'order'
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                              : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                          }`}>
                            {activity.type === 'order' ? (
                              <Package className="w-5 h-5 text-white" />
                            ) : (
                              <Truck className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-800 transition-colors duration-200">
                                {activity.customer}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={activity.type === 'order' ? 'default' : 'secondary'}
                                  className={`text-xs font-medium ${
                                    activity.type === 'order'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  }`}
                                >
                                  {activity.type}
                                </Badge>
                                <Badge
                                  variant={activity.status === 'completed' ? 'default' : 'secondary'}
                                  className={`text-xs font-medium ${
                                    activity.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-orange-100 text-orange-800'
                                  }`}
                                >
                                  {activity.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                              {activity.item}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600 text-lg">₹{activity.amount}</span>
                              <div className="flex items-center text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Store Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Store Performance</CardTitle>
                    <CardDescription className="text-gray-600">Key metrics and alerts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Average Rating</h4>
                        <p className="text-xs text-gray-600">Based on customer reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600 text-xl">{stats.averageRating}</span>
                      <span className="text-green-600 text-sm">/5</span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Low Stock Alert</h4>
                        <p className="text-xs text-gray-600">Items running low</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-orange-600 text-xl">{stats.lowStockItems}</span>
                      <span className="text-orange-600 text-sm ml-1">items</span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Pending Orders</h4>
                        <p className="text-xs text-gray-600">Awaiting processing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600 text-xl">{stats.pendingOrders}</span>
                      <span className="text-blue-600 text-sm ml-1">orders</span>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
