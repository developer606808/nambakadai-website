"use client"

import { useState, useRef, useEffect } from "react"
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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, MoreHorizontal, Edit, Trash, Eye, Plus, Filter, Loader2, Upload, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  toggleBannerStatus,
  Banner,
  CreateBannerData,
  UpdateBannerData
} from "@/lib/services/bannerService"

const bannerPositions = [
  { value: 0, label: "Hero Section" },
  { value: 1, label: "Sidebar" },
  { value: 2, label: "Footer" },
  { value: 3, label: "Popup" },
  { value: 4, label: "Category Page" },
  { value: 5, label: "Product Page" },
]

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // New banner form state
  const [newBanner, setNewBanner] = useState<CreateBannerData>({
    title: "",
    image: "",
    url: "",
    position: 0,
    isActive: true
  })

  // Load banners on component mount
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setIsDataLoading(true)
      const data = await getBanners()
      setBanners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast.error("Failed to load banners")
      setBanners([]) // Set empty array on error
    } finally {
      setIsDataLoading(false)
    }
  }

  // Filter banners based on search query and filters
  const filteredBanners = Array.isArray(banners) ? banners.filter((banner) => {
    const matchesSearch = banner.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && banner.isActive) ||
      (statusFilter === "inactive" && !banner.isActive)

    const matchesPosition = positionFilter === "all" || banner.position.toString() === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  }) : []

  // Pagination calculations
  const totalItems = filteredBanners?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBanners = filteredBanners?.slice(startIndex, endIndex) || []

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, positionFilter])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const handleAddBanner = async () => {
    // Validate required fields according to schema
    if (!newBanner.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!newBanner.image.trim()) {
      toast.error("Banner image is required")
      return
    }

    setIsLoading(true)
    try {
      const bannerData = await createBanner(newBanner)
      setBanners([...banners, bannerData])
      setIsAddDialogOpen(false)
      setNewBanner({
        title: "",
        image: "",
        url: "",
        position: 0,
        isActive: true
      })
      setPreviewImage(null)
      toast.success("Banner created successfully")
    } catch (error) {
      console.error("Error adding banner:", error)
      toast.error("Failed to create banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBanner = async () => {
    if (!currentBanner) return

    // Validate required fields according to schema
    if (!currentBanner.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!currentBanner.image.trim()) {
      toast.error("Banner image is required")
      return
    }

    setIsLoading(true)
    try {
      const updateData: UpdateBannerData = {
        title: currentBanner.title,
        image: currentBanner.image,
        url: currentBanner.url || undefined,
        position: currentBanner.position,
        isActive: currentBanner.isActive,
      }

      const updatedBanner = await updateBanner(currentBanner.id, updateData)
      const updatedBanners = banners.map((banner) =>
        banner.id === currentBanner.id ? updatedBanner : banner,
      )
      setBanners(updatedBanners)
      setIsEditDialogOpen(false)
      setCurrentBanner(null)
      setPreviewImage(null)
      toast.success("Banner updated successfully")
    } catch (error) {
      console.error("Error editing banner:", error)
      toast.error("Failed to update banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBanner = async () => {
    if (!currentBanner) return

    setIsLoading(true)
    try {
      // Delete banner from database
      await deleteBanner(currentBanner.id)

      // Delete associated image file if it's an uploaded file
      if (currentBanner.image && currentBanner.image.startsWith('/uploads/')) {
        try {
          await fetch(`/api/upload/banner?url=${encodeURIComponent(currentBanner.image)}`, {
            method: 'DELETE',
          })
        } catch (imageError) {
          console.warn('Failed to delete image file:', imageError)
          // Don't fail the whole operation if image deletion fails
        }
      }

      const updatedBanners = banners.filter((banner) => banner.id !== currentBanner.id)
      setBanners(updatedBanners)
      setIsDeleteDialogOpen(false)
      setCurrentBanner(null)
      toast.success("Banner deleted successfully")
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast.error("Failed to delete banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (banner: Banner) => {
    setIsLoading(true)
    try {
      const newIsActive = !banner.isActive
      const updatedBanner = await toggleBannerStatus(banner.id, newIsActive)
      const updatedBanners = banners.map((b) =>
        b.id === banner.id ? updatedBanner : b,
      )
      setBanners(updatedBanners)
      toast.success(`Banner ${newIsActive ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error("Error toggling banner status:", error)
      toast.error("Failed to update banner status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Upload file to server
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/banner', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      const imageUrl = result.data.url

      // Update banner data with server URL
      if (isEdit && currentBanner) {
        setCurrentBanner({ ...currentBanner, image: imageUrl })
      } else {
        setNewBanner({ ...newBanner, image: imageUrl })
      }

      // Update preview with server URL
      setPreviewImage(imageUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      setPreviewImage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = (isEdit = false) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e) => handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>, isEdit)
      fileInputRef.current.click()
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search banners..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {bannerPositions.map((position) => (
                    <SelectItem key={position.value} value={position.value.toString()}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setPositionFilter("all")
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Items per page selector and pagination info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">items per page</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Info</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading banners...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-16 w-24 overflow-hidden rounded-md border">
                          <Image
                            src={banner.image || "/placeholder.svg"}
                            alt={banner.title}
                            width={96}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{banner.title}</div>
                          {banner.url && (
                            <div className="flex items-center text-xs text-blue-600">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              {banner.url}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {bannerPositions.find((p) => p.value === banner.position)?.label || `Position ${banner.position}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => handleToggleStatus(banner)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Created: {new Date(banner.createdAt).toLocaleDateString()}</div>
                        <div>Updated: {new Date(banner.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        No analytics data available
                      </div>
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
                              setCurrentBanner(banner)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentBanner(banner)
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

        {/* Dynamic Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && (
                    <PaginationItem>
                      <span className="px-3 py-2">...</span>
                    </PaginationItem>
                  )}
                </>
              )}

              {/* Previous page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer"
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer"
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <span className="px-3 py-2">...</span>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Add Banner Dialog - Responsive */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open)
        if (!open) {
          setPreviewImage(null)
          setNewBanner({
            title: "",
            image: "",
            url: "",
            position: 0,
            isActive: true
          })
        }
      }}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>Create a new banner for your website.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-title">Title</Label>
                <Input
                  id="add-title"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="Banner title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-position">Position</Label>
                <Select value={newBanner.position?.toString() || "0"} onValueChange={(value) => setNewBanner({ ...newBanner, position: parseInt(value) })}>
                  <SelectTrigger id="add-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {bannerPositions.map((position) => (
                      <SelectItem key={position.value} value={position.value.toString()}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>





            <div className="grid gap-2">
              <Label htmlFor="add-image">Banner Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => triggerFileInput(false)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              {(previewImage || newBanner.image) && (
                <div className="mt-2">
                  <Image
                    src={previewImage || newBanner.image || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-url">Link URL</Label>
              <Input
                id="add-url"
                value={newBanner.url || ""}
                onChange={(e) => setNewBanner({ ...newBanner, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-status">Status</Label>
              <Select value={newBanner.isActive ? "active" : "inactive"} onValueChange={(value) => setNewBanner({ ...newBanner, isActive: value === "active" })}>
                <SelectTrigger id="add-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBanner} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Banner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setPreviewImage(null)
          setCurrentBanner(null)
        }
      }}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Make changes to the banner information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentBanner?.title || ""}
                  onChange={(e) => currentBanner && setCurrentBanner({ ...currentBanner, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  value={currentBanner?.position?.toString() || "0"}
                  onValueChange={(value) => currentBanner && setCurrentBanner({ ...currentBanner, position: parseInt(value) })}
                >
                  <SelectTrigger id="edit-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {bannerPositions.map((position) => (
                      <SelectItem key={position.value} value={position.value.toString()}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>





            <div className="grid gap-2">
              <Label htmlFor="edit-image">Banner Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => triggerFileInput(true)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              {(previewImage || currentBanner?.image) && (
                <div className="mt-2">
                  <Image
                    src={previewImage || currentBanner?.image || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-url">Link URL</Label>
              <Input
                id="edit-url"
                value={currentBanner?.url || ""}
                onChange={(e) => currentBanner && setCurrentBanner({ ...currentBanner, url: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={currentBanner?.isActive ? "active" : "inactive"}
                onValueChange={(value) => currentBanner && setCurrentBanner({ ...currentBanner, isActive: value === "active" })}
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
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBanner} disabled={isLoading}>
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

      {/* Delete Banner Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-12 w-16 overflow-hidden rounded-md">
              <Image
                src={currentBanner?.image || "/placeholder.svg?height=48&width=64"}
                alt={currentBanner?.title || "Banner"}
                width={64}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentBanner?.title}</p>
              <p className="text-sm text-muted-foreground">
                Position {currentBanner?.position} • {currentBanner?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBanner} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Banner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
