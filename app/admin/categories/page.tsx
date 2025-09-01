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
import { Plus, Search, MoreHorizontal, Edit, Trash, Tag, Loader2, Filter, Upload, X, Crop } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface Category {
  id: number
  name_en: string
  name_ta: string
  name_hi?: string
  slug: string
  image?: string
  icon?: string
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
    icon: "",
    type: "STORE" as "STORE" | "RENTAL",
    parentId: "",
  })

  // File upload states
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Image cropper states
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [crop, setCrop] = useState<CropType>({ unit: '%', width: 50, height: 50, x: 25, y: 25 })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  // Fetch categories
  const fetchCategories = async (resetPage = false) => {
    try {
      setLoading(true)
      const currentPage = resetPage ? 1 : pagination.page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (typeFilter) params.append('type', typeFilter)
      if (parentFilter) params.append('parentId', parentFilter)

      const response = await fetch(`/api/admin/categories?${params}`)
      const data = await response.json()

      if (data.success) {
        setCategories(data.data.categories)
        setPagination(prev => ({
          ...prev,
          ...data.data.pagination,
          page: currentPage
        }))
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

      // Upload image if selected
      let imageUrl = formData.image
      if (selectedImageFile) {
        console.log('Uploading image for new category...')
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
          console.log('Image uploaded successfully:', uploadedUrl)
        } else {
          console.error('Image upload failed')
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload image. Please try again.",
          })
          return
        }
      }

      console.log('Creating category with data:', {
        ...formData,
        name_en: formData.name_en.trim(),
        name_ta: formData.name_ta.trim(),
        name_hi: formData.name_hi?.trim() || '',
        icon: formData.icon?.trim() || '',
        image: imageUrl,
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
      })

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name_en: formData.name_en.trim(),
          name_ta: formData.name_ta.trim(),
          name_hi: formData.name_hi?.trim() || '',
          icon: formData.icon?.trim() || '',
          image: imageUrl,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      })

      const data = await response.json()
      console.log('Category creation response:', data)

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

      // Upload image if selected
      let imageUrl = formData.image
      if (selectedImageFile) {
        imageUrl = await uploadImage() || formData.image
      }

      const response = await fetch(`/api/admin/categories/${currentCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name_en: formData.name_en.trim(),
          name_ta: formData.name_ta.trim(),
          name_hi: formData.name_hi?.trim() || '',
          icon: formData.icon?.trim() || '',
          image: imageUrl,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the category in the local state immediately for better UX
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === currentCategory.id ? { ...cat, ...data.data } : cat
          )
        )

        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        setIsEditDialogOpen(false)
        setCurrentCategory(null)
        resetForm()
        // Refresh the list to ensure we have the latest data from server
        await fetchCategories()
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
      icon: "",
      type: "STORE",
      parentId: "",
    })
    setSelectedImageFile(null)
    setImagePreview("")
    setUploadingImage(false)
  }

  // Handle image file selection
  const handleImageFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('File selected:', file?.name, 'Size:', file?.size, 'Type:', file?.type)

    if (file) {
      // Client-side validation
      const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Only JPEG, PNG, and WebP images are allowed",
        })
        // Reset the file input
        event.target.value = ''
        return
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "File size must be less than 2MB",
        })
        // Reset the file input
        event.target.value = ''
        return
      }

      setSelectedImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log('File preview created')
        setImagePreview(e.target?.result as string)
      }
      reader.onerror = (e) => {
        console.error('Error reading file:', e)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read the selected file",
        })
      }
      reader.readAsDataURL(file)

      // Automatically upload the image
      console.log('Starting automatic upload...')
      await uploadImage()
    } else {
      console.log('No file selected')
    }
  }

  // Upload image to server
  const uploadImage = async () => {
    if (!selectedImageFile) {
      console.log('No file selected for upload')
      return null
    }

    try {
      setUploadingImage(true)
      console.log('Starting image upload for file:', selectedImageFile.name, 'Size:', selectedImageFile.size)

      const formDataUpload = new FormData()
      formDataUpload.append('file', selectedImageFile)

      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken')

      console.log('Sending upload request to /api/upload/category-images')
      const response = await fetch('/api/upload/category-images', {
        method: 'POST',
        headers: {
          // Send admin token in Authorization header
          ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
        },
        body: formDataUpload,
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed with response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log('Upload response data:', data)

      if (data.success) {
        console.log('Upload successful, URL:', data.url)
        setFormData(prev => ({ ...prev, image: data.url }))
        setSelectedImageFile(null) // Clear the selected file after successful upload
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
        return data.url
      } else {
        console.error('Upload failed with error:', data.error)
        throw new Error(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
      })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setSelectedImageFile(null)
    setImagePreview("")
    setFormData(prev => ({ ...prev, image: "" }))
    // Reset the file input
    const fileInput = document.getElementById('image-file') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Get cropped image as blob
  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width
    canvas.height = crop.height

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  // Handle crop completion
  const onCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop)
  }

  // Apply crop and create new file
  const applyCrop = async () => {
    if (completedCrop && imageRef && selectedImageFile) {
      try {
        const croppedBlob = await getCroppedImg(imageRef, completedCrop)
        const croppedFile = new File([croppedBlob], selectedImageFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })

        // Update the selected file and preview
        setSelectedImageFile(croppedFile)

        // Create new preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(croppedFile)

        setIsCropDialogOpen(false)
        toast({
          title: "Success",
          description: "Image cropped successfully",
        })
      } catch (error) {
        console.error('Error cropping image:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to crop image",
        })
      }
    }
  }

  // Open crop dialog
  const openCropDialog = () => {
    setIsCropDialogOpen(true)
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
      icon: category.icon || "",
      type: category.type,
      parentId: category.parentId?.toString() || "",
    })
    // Set image preview if image exists
    if (category.image) {
      setImagePreview(category.image)
    }
    setSelectedImageFile(null)
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
    fetchCategories(true) // Reset to page 1 when searching
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  useEffect(() => {
    fetchCategories()
  }, [pagination.page, searchTerm, typeFilter, parentFilter])

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
            fetchCategories(true); // Reset to page 1 when clearing filters
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
              <TableHead>Image</TableHead>
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
                <TableCell colSpan={8} className="text-center py-8">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No categories found</p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name_en}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                        <Tag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
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
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {isAddDialogOpen ? "Add Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isAddDialogOpen ? "Create a new category for organizing products." : "Update the category information."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name fields - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_en" className="text-sm font-medium">Name (English) *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="Enter English name"
                  required
                  maxLength={100}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ta" className="text-sm font-medium">Name (Tamil) *</Label>
                <Input
                  id="name_ta"
                  value={formData.name_ta}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ta: e.target.value }))}
                  placeholder="Enter Tamil name"
                  required
                  maxLength={100}
                  className="h-10"
                />
              </div>
            </div>

            {/* Optional name and slug fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_hi" className="text-sm font-medium">Name (Hindi)</Label>
                <Input
                  id="name_hi"
                  value={formData.name_hi}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_hi: e.target.value }))}
                  placeholder="Enter Hindi name (optional)"
                  maxLength={100}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                  className="h-10"
                />
              </div>
            </div>

            {/* Type and Parent Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "STORE" | "RENTAL") => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STORE">Store</SelectItem>
                    <SelectItem value="RENTAL">Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-sm font-medium">Parent Category</Label>
                <Select value={formData.parentId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === "none" ? "" : value }))}>
                  <SelectTrigger className="h-10">
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
            {/* Icon field */}
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-medium">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Enter icon name or class (optional)"
                className="h-10"
              />
            </div>

            {/* Image upload section */}
            <div className="space-y-3">
              <Label htmlFor="image" className="text-sm font-medium">Category Image</Label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border shadow-sm"
                    />
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      {selectedImageFile && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full bg-white/90 hover:bg-white"
                          onClick={openCropDialog}
                          title="Crop image"
                        >
                          <Crop className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={removeImage}
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    disabled={uploadingImage}
                    className="h-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>
                {formData.image && !selectedImageFile && (
                  <p className="text-xs sm:text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                    Current image: <span className="font-medium">{formData.image.split('/').pop()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
                setCurrentCategory(null)
                resetForm()
              }}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleCreate : handleUpdate}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAddDialogOpen ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Adjust the crop area to select the portion of the image you want to keep.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {imagePreview && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  onComplete={onCropComplete}
                  aspect={1}
                  className="max-w-full max-h-96"
                >
                  <img
                    ref={setImageRef}
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-w-full max-h-96 object-contain"
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyCrop} disabled={!completedCrop}>
              Apply Crop
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
