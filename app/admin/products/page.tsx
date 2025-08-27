"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react"

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 2.99,
    category: "Vegetables",
    store: "Green Farm",
    state: "Tokyo",
    city: "Shibuya",
    status: "active",
    stock: 45,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Red Apples",
    price: 1.49,
    category: "Fruits",
    store: "Orchard Fresh",
    state: "Osaka",
    city: "Osaka City",
    status: "active",
    stock: 120,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Organic Milk",
    price: 3.99,
    category: "Dairy",
    store: "Happy Cows",
    state: "Hokkaido",
    city: "Sapporo",
    status: "active",
    stock: 24,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Brown Rice",
    price: 5.99,
    category: "Grains",
    store: "Grain Valley",
    state: "Kyoto",
    city: "Kyoto City",
    status: "active",
    stock: 56,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Fresh Chicken",
    price: 8.99,
    category: "Poultry",
    store: "Free Range Farms",
    state: "Fukuoka",
    city: "Fukuoka City",
    status: "inactive",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Atlantic Salmon",
    price: 12.99,
    category: "Seafood",
    store: "Ocean Fresh",
    state: "Kanagawa",
    city: "Yokohama",
    status: "active",
    stock: 18,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Fresh Basil",
    price: 1.99,
    category: "Herbs",
    store: "Herb Garden",
    state: "Aichi",
    city: "Nagoya",
    status: "active",
    stock: 30,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Almonds",
    price: 7.99,
    category: "Nuts",
    store: "Nut House",
    state: "Tokyo",
    city: "Shinjuku",
    status: "active",
    stock: 42,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "Organic Carrots",
    price: 2.49,
    category: "Vegetables",
    store: "Green Farm",
    state: "Osaka",
    city: "Osaka City",
    status: "inactive",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Honey",
    price: 9.99,
    category: "Other",
    store: "Bee Happy",
    state: "Hokkaido",
    city: "Hakodate",
    status: "active",
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for stores, states, and cities
const mockStores = [
  "All Stores",
  "Green Farm",
  "Orchard Fresh",
  "Happy Cows",
  "Grain Valley",
  "Free Range Farms",
  "Ocean Fresh",
  "Herb Garden",
  "Nut House",
  "Bee Happy",
]
const mockStates = ["All States", "Tokyo", "Osaka", "Hokkaido", "Kyoto", "Fukuoka", "Kanagawa", "Aichi"]
const mockCities = [
  "All Cities",
  "Shibuya",
  "Shinjuku",
  "Osaka City",
  "Sapporo",
  "Kyoto City",
  "Fukuoka City",
  "Yokohama",
  "Nagoya",
  "Hakodate",
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [storeFilter, setStoreFilter] = useState("All Stores")
  const [stateFilter, setStateFilter] = useState("All States")
  const [cityFilter, setCityFilter] = useState("All Cities")
  const [isLoading, setIsLoading] = useState(false)

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStore = storeFilter === "All Stores" || product.store === storeFilter
    const matchesState = stateFilter === "All States" || product.state === stateFilter
    const matchesCity = cityFilter === "All Cities" || product.city === cityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesStore && matchesState && matchesCity
  })

  const handleEditProduct = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id ? { ...product, ...currentProduct } : product,
      )
      setProducts(updatedProducts)
      setIsEditDialogOpen(false)
      setCurrentProduct(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteProduct = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedProducts = products.filter((product) => product.id !== currentProduct.id)
      setProducts(updatedProducts)
      setIsDeleteDialogOpen(false)
      setCurrentProduct(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleToggleStatus = (product: any) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedProducts = products.map((p) =>
        p.id === product.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p,
      )
      setProducts(updatedProducts)
      setIsLoading(false)
    }, 500)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setStoreFilter("All Stores")
    setStateFilter("All States")
    setCityFilter("All Cities")
  }

  const categories = ["Vegetables", "Fruits", "Dairy", "Grains", "Poultry", "Seafood", "Herbs", "Nuts", "Other"]

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        </div>

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
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                {mockStores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {mockStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {mockCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.store}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{product.city}</span>
                        <span className="text-xs text-muted-foreground">{product.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>¥{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "success" : "destructive"}>
                        {product.status === "active" ? "Active" : "Inactive"}
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
                              setCurrentProduct(product)
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
                            {product.status === "active" ? (
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

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={currentProduct?.name || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
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
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={currentProduct?.category || ""}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={currentProduct?.stock || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-store">Store</Label>
                <Select
                  value={currentProduct?.store || ""}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, store: value })}
                >
                  <SelectTrigger id="edit-store">
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStores.slice(1).map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentProduct?.status || ""}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State</Label>
                <Select
                  value={currentProduct?.state || ""}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, state: value })}
                >
                  <SelectTrigger id="edit-state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStates.slice(1).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Select
                  value={currentProduct?.city || ""}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, city: value })}
                >
                  <SelectTrigger id="edit-city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCities.slice(1).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                src={currentProduct?.image || "/placeholder.svg?height=40&width=40"}
                alt={currentProduct?.name || "Product"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentProduct?.name}</p>
              <p className="text-sm text-muted-foreground">
                ¥{currentProduct?.price?.toFixed(2)} • {currentProduct?.category}
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
