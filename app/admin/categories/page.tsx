"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: number
  name_en: string
  name_ta: string
  name_hi?: string
  slug: string
  image?: string
  type: 'STORE' | 'RENTAL'
  parentId?: number
  parent?: { id: number; name_en: string; name_ta: string }
  children?: { id: number; name_en: string; name_ta: string }[]
  _count: { products: number }
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [parentFilter, setParentFilter] = useState("")
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name_en: "",
    name_ta: "",
    name_hi: "",
    slug: "",
    image: "",
    type: "STORE" as "STORE" | "RENTAL",
    parentId: "",
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (typeFilter) params.append('type', typeFilter)
      if (parentFilter) params.append('parentId', parentFilter)

      const response = await fetch(`/api/admin/categories?${params}`)
      const data = await response.json()

      if (data.success) {
        setCategories(data.data.categories)
        setPagination(data.data.pagination)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to fetch categories",
        })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      })
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const errors: string[] = []

    if (!formData.name_en.trim()) {
      errors.push('English name is required')
    }
    if (!formData.name_ta.trim()) {
      errors.push('Tamil name is required')
    }
    if (!formData.type) {
      errors.push('Type is required')
    }
    if (formData.name_en.length > 100) {
      errors.push('English name must be less than 100 characters')
    }
    if (formData.name_ta.length > 100) {
      errors.push('Tamil name must be less than 100 characters')
    }
    if (formData.name_hi && formData.name_hi.length > 100) {
      errors.push('Hindi name must be less than 100 characters')
    }

    return errors
  }

  // Create category
  const handleCreate = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationErrors.join(', '),
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name_en: formData.name_en.trim(),
          name_ta: formData.name_ta.trim(),
          name_hi: formData.name_hi?.trim() || '',
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Category created successfully",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to create category",
        })
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update category
  const handleUpdate = async () => {
    if (!currentCategory) return

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationErrors.join(', '),
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/categories/${currentCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name_en: formData.name_en.trim(),
          name_ta: formData.name_ta.trim(),
          name_hi: formData.name_hi?.trim() || '',
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        setIsEditDialogOpen(false)
        setCurrentCategory(null)
        resetForm()
        fetchCategories()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update category",
        })
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete category
  const handleDelete = async () => {
    if (!currentCategory) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/categories/${currentCategory.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setCurrentCategory(null)
        fetchCategories()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to delete category",
        })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name_en: "",
      name_ta: "",
      name_hi: "",
      slug: "",
      image: "",
      type: "STORE",
      parentId: "",
    })
  }

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category)
    setFormData({
      name_en: category.name_en,
      name_ta: category.name_ta,
      name_hi: category.name_hi || "",
      slug: category.slug,
      image: category.image || "",
      type: category.type,
      parentId: category.parentId?.toString() || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  // Generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchCategories()
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  useEffect(() => {
    fetchCategories()
  }, [pagination.page])

  useEffect(() => {
    if (formData.name_en && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name_en) }))
    }
  }, [formData.name_en])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="STORE">Store</SelectItem>
              <SelectItem value="RENTAL">Rental</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setTypeFilter("");
            setParentFilter("");
            setPagination(prev => ({ ...prev, page: 1 }));
            fetchCategories();
          }}>
            <Filter className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Loading categories...</p>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No categories found</p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name_en}</div>
                      <div className="text-sm text-muted-foreground">{category.name_ta}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.type === 'STORE' ? 'default' : 'secondary'}>
                      {category.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.parent ? (
                      <div className="text-sm">
                        <div>{category.parent.name_en}</div>
                        <div className="text-muted-foreground">{category.parent.name_ta}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Root</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category._count.products}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(category)}
                          className="text-destructive"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} categories
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.hasPrev && handlePageChange(pagination.page - 1)}
                  className={!pagination.hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === pagination.page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.hasNext && handlePageChange(pagination.page + 1)}
                  className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(false)
          setCurrentCategory(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? "Create a new category for organizing products." : "Update the category information."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_en">Name (English) *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="Enter English name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ta">Name (Tamil) *</Label>
                <Input
                  id="name_ta"
                  value={formData.name_ta}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ta: e.target.value }))}
                  placeholder="Enter Tamil name"
                  required
                  maxLength={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_hi">Name (Hindi)</Label>
                <Input
                  id="name_hi"
                  value={formData.name_hi}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_hi: e.target.value }))}
                  placeholder="Enter Hindi name (optional)"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "STORE" | "RENTAL") => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STORE">Store</SelectItem>
                    <SelectItem value="RENTAL">Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select value={formData.parentId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === "none" ? "" : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Root)</SelectItem>
                    {categories.filter(cat => cat.id !== currentCategory?.id).map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
              setCurrentCategory(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={isAddDialogOpen ? handleCreate : handleUpdate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAddDialogOpen ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentCategory?.name_en}"? This action cannot be undone.
              {currentCategory?._count?.products && currentCategory._count.products > 0 && (
                <div className="mt-2 p-2 bg-destructive/10 rounded text-destructive text-sm">
                  Warning: This category has {currentCategory._count.products} associated products.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
