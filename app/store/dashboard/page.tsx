"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StoreLayout from "@/components/store/store-layout"
import { Package, DollarSign, Users, MessageSquare, Eye, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { LazyImage } from "@/components/ui/lazy-image"

const stats = [
  {
    title: "Total Products",
    value: "24",
    change: "+2 this week",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Total Sales",
    value: "$12,450",
    change: "+15% from last month",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Customers",
    value: "156",
    change: "+8 new this week",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Messages",
    value: "7",
    change: "3 unread",
    icon: MessageSquare,
    color: "text-orange-600",
  },
]

const recentProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: "$4.99/kg",
    stock: 45,
    image: "/placeholder.svg?height=60&width=60",
    status: "Active",
  },
  {
    id: 2,
    name: "Fresh Carrots",
    price: "$2.99/kg",
    stock: 23,
    image: "/placeholder.svg?height=60&width=60",
    status: "Active",
  },
  {
    id: 3,
    name: "Green Lettuce",
    price: "$1.99/head",
    stock: 8,
    image: "/placeholder.svg?height=60&width=60",
    status: "Low Stock",
  },
]

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Sarah Johnson",
    amount: "$24.99",
    status: "Pending",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Mike Chen",
    amount: "$18.50",
    status: "Completed",
    date: "2024-01-14",
  },
  {
    id: "#ORD-003",
    customer: "Emma Davis",
    amount: "$32.75",
    status: "Processing",
    date: "2024-01-14",
  },
]

export default function StoreDashboard() {
  return (
    <StoreLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
          </div>
          <Button asChild>
            <Link href="/store/products/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/store/products">
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <LazyImage
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{product.stock} in stock</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link href="/store/products/add">
                  <Plus className="h-6 w-6" />
                  <span>Add New Product</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link href="/store/messages">
                  <MessageSquare className="h-6 w-6" />
                  <span>Check Messages</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link href="/store/edit">
                  <Settings className="h-6 w-6" />
                  <span>Store Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  )
}
