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
import { Switch } from "@/components/ui/switch"
import { Search, MoreHorizontal, Edit, Trash, Eye, Plus, Filter, Loader2, Upload, ExternalLink } from "lucide-react"

// Mock data for banners
const mockBanners = [
  {
    id: 1,
    title: "Summer Sale 2024",
    description: "Get up to 50% off on fresh vegetables and fruits",
    image: "/placeholder.svg?height=200&width=400",
    link: "/products?category=vegetables",
    position: "hero",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    clicks: 1250,
    impressions: 15000,
    createdAt: "2024-05-15",
  },
  {
    id: 2,
    title: "Farm Equipment Rental",
    description: "Rent professional farming equipment at affordable rates",
    image: "/placeholder.svg?height=200&width=400",
    link: "/rentals",
    position: "sidebar",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    clicks: 890,
    impressions: 12000,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    title: "Organic Certification Program",
    description: "Join our organic certification program for premium pricing",
    image: "/placeholder.svg?height=200&width=400",
    link: "/seller/register",
    position: "footer",
    status: "inactive",
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    clicks: 456,
    impressions: 8500,
    createdAt: "2024-02-15",
  },
  {
    id: 4,
    title: "Mobile App Launch",
    description: "Download our new mobile app for better shopping experience",
    image: "/placeholder.svg?height=200&width=400",
    link: "/mobile-app",
    position: "popup",
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    clicks: 2100,
    impressions: 25000,
    createdAt: "2024-06-20",
  },
]

const bannerPositions = [
  { value: "hero", label: "Hero Section" },
  { value: "sidebar", label: "Sidebar" },
  { value: "footer", label: "Footer" },
  { value: "popup", label: "Popup" },
  { value: "category", label: "Category Page" },
  { value: "product", label: "Product Page" },
]

export default function BannersPage() {
  const [banners, setBanners] = useState(mockBanners)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBanner, setCurrentBanner] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // New banner form state
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    position: "",
    status: "active",
    startDate: "",
    endDate: "",
  })

  // Filter banners based on search query and filters
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || banner.status === statusFilter
    const matchesPosition = positionFilter === "all" || banner.position === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  })

  const handleAddBanner = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const banner = {
        ...newBanner,
        id: banners.length + 1,
        clicks: 0,
        impressions: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setBanners([...banners, banner])
      setIsAddDialogOpen(false)
      setNewBanner({
        title: "",
        description: "",
        image: "",
        link: "",
        position: "",
        status: "active",
        startDate: "",
        endDate: "",
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleEditBanner = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedBanners = banners.map((banner) =>
        banner.id === currentBanner.id ? { ...banner, ...currentBanner } : banner,
      )
      setBanners(updatedBanners)
      setIsEditDialogOpen(false)
      setCurrentBanner(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteBanner = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedBanners = banners.filter((banner) => banner.id !== currentBanner.id)
      setBanners(updatedBanners)
      setIsDeleteDialogOpen(false)
      setCurrentBanner(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleToggleStatus = (banner: any) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedBanners = banners.map((b) =>
        b.id === banner.id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b,
      )
      setBanners(updatedBanners)
      setIsLoading(false)
    }, 500)
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
                    <SelectItem key={position.value} value={position.value}>
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanners.map((banner) => (
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
                          <div className="text-sm text-muted-foreground line-clamp-2">{banner.description}</div>
                          {banner.link && (
                            <div className="flex items-center text-xs text-blue-600">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              {banner.link}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {bannerPositions.find((p) => p.value === banner.position)?.label || banner.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={banner.status === "active" ? "success" : "secondary"}>
                          {banner.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={banner.status === "active"}
                          onCheckedChange={() => handleToggleStatus(banner)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Start: {banner.startDate}</div>
                        <div>End: {banner.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{banner.clicks.toLocaleString()} clicks</div>
                        <div className="text-muted-foreground">{banner.impressions.toLocaleString()} views</div>
                        <div className="text-xs text-green-600">
                          CTR: {((banner.clicks / banner.impressions) * 100).toFixed(2)}%
                        </div>
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

      {/* Add Banner Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>Create a new banner for your website.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Select
                  value={newBanner.position}
                  onValueChange={(value) => setNewBanner({ ...newBanner, position: value })}
                >
                  <SelectTrigger id="add-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {bannerPositions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={newBanner.description}
                onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                placeholder="Banner description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-image">Banner Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="add-image"
                  value={newBanner.image}
                  onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                  placeholder="Image URL or upload"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {newBanner.image && (
                <div className="mt-2">
                  <Image
                    src={newBanner.image || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-link">Link URL</Label>
              <Input
                id="add-link"
                value={newBanner.link}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-start-date">Start Date</Label>
                <Input
                  id="add-start-date"
                  type="date"
                  value={newBanner.startDate}
                  onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-end-date">End Date</Label>
                <Input
                  id="add-end-date"
                  type="date"
                  value={newBanner.endDate}
                  onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-status">Status</Label>
              <Select value={newBanner.status} onValueChange={(value) => setNewBanner({ ...newBanner, status: value })}>
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
          <DialogFooter>
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

      {/* Edit Banner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Make changes to the banner information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentBanner?.title || ""}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  value={currentBanner?.position || ""}
                  onValueChange={(value) => setCurrentBanner({ ...currentBanner, position: value })}
                >
                  <SelectTrigger id="edit-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {bannerPositions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
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
                value={currentBanner?.description || ""}
                onChange={(e) => setCurrentBanner({ ...currentBanner, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">Banner Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-image"
                  value={currentBanner?.image || ""}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, image: e.target.value })}
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {currentBanner?.image && (
                <div className="mt-2">
                  <Image
                    src={currentBanner.image || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-link">Link URL</Label>
              <Input
                id="edit-link"
                value={currentBanner?.link || ""}
                onChange={(e) => setCurrentBanner({ ...currentBanner, link: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={currentBanner?.startDate || ""}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={currentBanner?.endDate || ""}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={currentBanner?.status || ""}
                onValueChange={(value) => setCurrentBanner({ ...currentBanner, status: value })}
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
          <DialogFooter>
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

      {/* Delete Banner Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                {currentBanner?.position} • {currentBanner?.status}
              </p>
            </div>
          </div>
          <DialogFooter>
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
