"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Edit, Trash, Tag, Loader2, Filter } from "lucide-react"

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: "Vegetables",
    slug: "vegetables",
    description: "Fresh farm vegetables",
    productCount: 124,
    type: "Store",
  },
  { id: 2, name: "Fruits", slug: "fruits", description: "Seasonal fruits", productCount: 98, type: "Store" },
  { id: 3, name: "Dairy", slug: "dairy", description: "Milk and dairy products", productCount: 56, type: "Store" },
  {
    id: 4,
    name: "Grains",
    slug: "grains",
    description: "Rice, wheat and other grains",
    productCount: 78,
    type: "Store",
  },
  { id: 5, name: "Meat", slug: "meat", description: "Fresh meat products", productCount: 45, type: "Store" },
  {
    id: 6,
    name: "Poultry",
    slug: "poultry",
    description: "Chicken and other poultry",
    productCount: 34,
    type: "Store",
  },
  { id: 7, name: "Seafood", slug: "seafood", description: "Fresh seafood", productCount: 23, type: "Store" },
  { id: 8, name: "Herbs", slug: "herbs", description: "Fresh and dried herbs", productCount: 67, type: "Store" },
  { id: 9, name: "Nuts", slug: "nuts", description: "Various nuts and seeds", productCount: 42, type: "Store" },
  {
    id: 10,
    name: "Organic",
    slug: "organic",
    description: "Certified organic products",
    productCount: 89,
    type: "Store",
  },
  {
    id: 11,
    name: "Tractors",
    slug: "tractors",
    description: "Farm tractors for rent",
    productCount: 15,
    type: "Rentals",
  },
  {
    id: 12,
    name: "Harvesters",
    slug: "harvesters",
    description: "Harvesting equipment",
    productCount: 8,
    type: "Rentals",
  },
  { id: 13, name: "Plows", slug: "plows", description: "Plowing equipment", productCount: 12, type: "Rentals" },
  { id: 14, name: "Trucks", slug: "trucks", description: "Transport vehicles", productCount: 20, type: "Rentals" },
  {
    id: 15,
    name: "Sprayers",
    slug: "sprayers",
    description: "Crop spraying equipment",
    productCount: 10,
    type: "Rentals",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter categories based on search query and type filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || category.type === typeFilter

    return matchesSearch && matchesType
  })

  const handleAddCategory = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newCategory = {
        id: categories.length + 1,
        name: currentCategory.name,
        slug: currentCategory.name.toLowerCase().replace(/\s+/g, "-"),
        description: currentCategory.description,
        type: currentCategory.type,
        productCount: 0,
      }
      setCategories([...categories, newCategory])
      setIsAddDialogOpen(false)
      setCurrentCategory(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleEditCategory = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? { ...category, ...currentCategory } : category,
      )
      setCategories(updatedCategories)
      setIsEditDialogOpen(false)
      setCurrentCategory(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteCategory = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedCategories = categories.filter((category) => category.id !== currentCategory.id)
      setCategories(updatedCategories)
      setIsDeleteDialogOpen(false)
      setCurrentCategory(null)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentCategory({ name: "", description: "", type: "Store" })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Store">Store</SelectItem>
                <SelectItem value="Rentals">Rentals</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("")
                setTypeFilter("all")
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description.length > 50
                        ? `${category.description.slice(0, 50)}...`
                        : category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.type === "Store" ? "default" : "secondary"}>{category.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{category.productCount}</TableCell>
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
                              setCurrentCategory(category)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentCategory(category)
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

      {/* Add Category Dialog - Responsive */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category for products or rentals.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentCategory?.name || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={currentCategory?.type || "Store"}
                onValueChange={(value) => setCurrentCategory({ ...currentCategory, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Store">Store</SelectItem>
                  <SelectItem value="Rentals">Rentals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentCategory?.description || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                placeholder="Category description"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Make changes to the category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={currentCategory?.name || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={currentCategory?.type || "Store"}
                onValueChange={(value) => setCurrentCategory({ ...currentCategory, type: value })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Store">Store</SelectItem>
                  <SelectItem value="Rentals">Rentals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentCategory?.description || ""}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
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

      {/* Delete Category Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentCategory?.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{currentCategory?.productCount} products</p>
                {currentCategory?.type && (
                  <Badge variant={currentCategory.type === "Store" ? "default" : "secondary"} className="text-xs">
                    {currentCategory.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
