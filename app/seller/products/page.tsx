"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SellerProducts() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products?sellerOnly=true")
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      
      const data = await response.json()
      setProducts(data.products)
      setError(null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || product.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products

  const getStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    } else if (stock <= 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    }
  }

  const getStockIcon = (stock: number) => {
    if (stock === 0) return <AlertTriangle className="w-4 h-4 text-red-500" />
    if (stock <= 10) return <TrendingDown className="w-4 h-4 text-yellow-500" />
    return <TrendingUp className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              Products
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Manage your product inventory and listings with ease
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 px-4 py-2 text-sm font-medium shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {displayProducts.length} Products
            </Badge>
            <Link href="/seller/products/new">
              <Button className="h-12 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
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
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-3xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-800">Total Products</p>
                    <p className="text-3xl font-bold text-blue-700">{displayProducts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">All products</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-3xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-800">Active Products</p>
                    <p className="text-3xl font-bold text-green-700">
                      {displayProducts.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs font-medium">Live & selling</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-3xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-yellow-800">Low Stock</p>
                    <p className="text-3xl font-bold text-yellow-700">
                      {displayProducts.filter(p => p.status === 'low_stock').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-yellow-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Needs attention</span>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-3xl"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-800">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-700">
                      {displayProducts.filter(p => p.status === 'out_of_stock').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs font-medium">Action required</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search products by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={`h-10 px-4 font-medium transition-all duration-200 ${
                      filterStatus === "all"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    All ({displayProducts.length})
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                    className={`h-10 px-4 font-medium transition-all duration-200 ${
                      filterStatus === "active"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    Active ({displayProducts.filter(p => p.status === 'active').length})
                  </Button>
                  <Button
                    variant={filterStatus === "low_stock" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("low_stock")}
                    className={`h-10 px-4 font-medium transition-all duration-200 ${
                      filterStatus === "low_stock"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                        : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
                    }`}
                  >
                    Low Stock ({displayProducts.filter(p => p.status === 'low_stock').length})
                  </Button>
                  <Button
                    variant={filterStatus === "out_of_stock" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("out_of_stock")}
                    className={`h-10 px-4 font-medium transition-all duration-200 ${
                      filterStatus === "out_of_stock"
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
                        : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    Out of Stock ({displayProducts.filter(p => p.status === 'out_of_stock').length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
              </p>
              <Link href="/seller/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative">
                        <img
                          src={product.images?.[0] || "/api/placeholder/100/100"}
                          alt={product.title || product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <div className="absolute -top-1 -right-1">
                          {getStatusBadge(product.stock)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate mb-1">
                          {product.title || product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.category?.name_en || "No Category"}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-xl sm:text-2xl font-bold text-green-600">₹{product.price}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStockIcon(product.stock)}
                            <span className="text-sm text-gray-600 font-medium">Stock: {product.stock}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">
                              {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/seller/products/edit?id=${product.publicKey}`)}
                          className="h-9 px-3 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  try {
                                    const response = await fetch(`/api/products/${product.publicKey}`, {
                                      method: 'DELETE',
                                    });

                                    if (!response.ok) {
                                      throw new Error('Failed to delete product');
                                    }

                                    // Remove product from list
                                    setProducts(products.filter(p => p.id !== product.id));
                                    toast({
                                      title: "Product deleted",
                                      description: "The product has been successfully deleted.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete product. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>
      </div>
    </div>
  )
}