"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle, Loader2, Filter } from "lucide-react"

interface Product {
  id: number
  title: string
  description?: string
  price: number
  stock: number
  images: string[]
  slug: string
  adId: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
    slug: string
  }
  store: {
    id: number
    name: string
  }
  unit: {
    id: number
    name: string
    symbol: string
  }
  location: {
    state: string
    city: string
  }
  seller: {
    id: number
    name: string
    email: string
  }
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [storeFilter, setStoreFilter] = useState("all")
  const [stateFilter, setStateFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch products from API
  const fetchProducts = async (page = 1, search = "", status = "all", categoryId = "all", storeId = "all", state = "all", city = "all") => {
    try {
      setIsLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)
      if (status !== 'all') params.append('status', status)
      if (categoryId !== 'all') params.append('categoryId', categoryId)
      if (storeId !== 'all') params.append('storeId', storeId)

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }

  // Load products on component mount and when filters change
  useEffect(() => {
    fetchProducts(pagination.page, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter)
  }, [pagination.page, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        fetchProducts(1, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleEditProduct = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      // Refresh products list
      await fetchProducts(pagination.page, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter)
      setIsEditDialogOpen(false)
      setCurrentProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
      setError(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/products/${currentProduct.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete product')
      }

      // Refresh products list
      await fetchProducts(pagination.page, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter)
      setIsDeleteDialogOpen(false)
      setCurrentProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      setIsLoading(true)
      setError("")

      const updateData = {
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock > 0 ? 0 : 1, // Toggle between 0 and 1
        categoryId: product.category.id,
        unitId: product.unit.id,
        isFeatured: product.isFeatured,
      }

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product status')
      }

      // Refresh products list
      await fetchProducts(pagination.page, searchQuery, statusFilter, categoryFilter, storeFilter, stateFilter, cityFilter)
    } catch (error) {
      console.error('Error updating product status:', error)
      setError(error instanceof Error ? error.message : 'Failed to update product status')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setStoreFilter("all")
    setStateFilter("all")
    setCityFilter("all")
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* Categories will be populated dynamically from API if needed */}
              </SelectContent>
            </Select>

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {/* Stores will be populated dynamically from API if needed */}
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {/* States will be populated dynamically from API if needed */}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {/* Cities will be populated dynamically from API if needed */}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Ad ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.store.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{product.location.city}</span>
                        <span className="text-xs text-muted-foreground">{product.location.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="font-mono text-xs text-gray-600">{product.adId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentProduct({
                                ...product,
                                title: product.title,
                                description: product.description || "",
                                price: product.price,
                                stock: product.stock,
                                categoryId: product.category.id,
                                unitId: product.unit.id,
                                isFeatured: product.isFeatured,
                              })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                            {product.stock > 0 ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentProduct(product)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.pages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.page > 1) handlePageChange(pagination.page - 1)
                  }}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.page}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.page < pagination.pages) handlePageChange(pagination.page + 1)
                  }}
                  className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Edit Product Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to the product information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Product Title</Label>
                <Input
                  id="edit-title"
                  value={currentProduct?.title || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={currentProduct?.price || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={currentProduct?.stock || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-featured">Featured</Label>
                <Select
                  value={currentProduct?.isFeatured ? "featured" : "not-featured"}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, isFeatured: value === "featured" })}
                >
                  <SelectTrigger id="edit-featured">
                    <SelectValue placeholder="Select featured status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={currentProduct?.category?.name || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-store">Store</Label>
                <Input
                  id="edit-store"
                  value={currentProduct?.store?.name || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-seller">Seller</Label>
                <Input
                  id="edit-seller"
                  value={currentProduct?.seller?.name || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={`${currentProduct?.location?.city || ''}, ${currentProduct?.location?.state || ''}`}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentProduct?.description || ""}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentProduct?.images?.[0] || "/placeholder.svg?height=40&width=40"}
                alt={currentProduct?.title || "Product"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentProduct?.title}</p>
              <p className="text-sm text-muted-foreground">
                ₹{currentProduct?.price?.toFixed(2)} • {currentProduct?.category?.name}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
