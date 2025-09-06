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
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Loader2,
  Store,
  MapPin,
  Phone,
  Calendar,
  Check,
  X,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Store {
  id: number
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  banner?: string
  isApproved: boolean
  isBlocked: boolean
  createdAt: string
  owner: {
    id: number
    name: string
    email: string
  }
  stats: {
    products: number
    ratings: number
    averageRating: number
  }
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function StoresPage() {
  const { toast } = useToast()
  const [stores, setStores] = useState<Store[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStore, setCurrentStore] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Fetch stores from API
  const fetchStores = async (page = 1, search = "", status = "all", location = "all") => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)
      if (status !== 'all') params.append('status', status)
      if (location !== 'all') params.append('location', location)

      const response = await fetch(`/api/admin/stores?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stores')
      }

      setStores(data.stores)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching stores:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch stores',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }

  // Load stores on component mount and when filters change
  useEffect(() => {
    fetchStores(pagination.page, searchQuery, statusFilter, locationFilter)
  }, [pagination.page, searchQuery, statusFilter, locationFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        fetchStores(1, searchQuery, statusFilter, locationFilter)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleEditStore = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/admin/stores/${currentStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentStore),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update store')
      }

      // Refresh stores list
      await fetchStores(pagination.page, searchQuery, statusFilter, locationFilter)
      setIsEditDialogOpen(false)
      setCurrentStore(null)

      toast({
        title: "Success",
        description: "Store updated successfully",
      })
    } catch (error) {
      console.error('Error updating store:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update store',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStore = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/admin/stores/${currentStore.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete store')
      }

      // Refresh stores list
      await fetchStores(pagination.page, searchQuery, statusFilter, locationFilter)
      setIsDeleteDialogOpen(false)
      setCurrentStore(null)

      toast({
        title: "Success",
        description: "Store deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting store:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete store',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleApproval = async (store: Store) => {
    try {
      setIsLoading(true)

      const updateData = {
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        email: store.email,
        isApproved: !store.isApproved, // Toggle the approval status
        isBlocked: store.isBlocked,
      }

      const response = await fetch(`/api/admin/stores/${store.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update store approval status')
      }

      // Refresh stores list
      await fetchStores(pagination.page, searchQuery, statusFilter, locationFilter)

      toast({
        title: "Success",
        description: `Store ${!store.isApproved ? 'approved' : 'unapproved'} successfully`,
      })
    } catch (error) {
      console.error('Error updating store approval:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update store approval status',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActivation = async (store: Store) => {
    try {
      setIsLoading(true)

      const updateData = {
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        email: store.email,
        isApproved: store.isApproved,
        isBlocked: !store.isBlocked, // Toggle the blocked status
      }

      const response = await fetch(`/api/admin/stores/${store.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update store activation status')
      }

      // Refresh stores list
      await fetchStores(pagination.page, searchQuery, statusFilter, locationFilter)

      toast({
        title: "Success",
        description: `Store ${!store.isBlocked ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      console.error('Error updating store activation:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update store activation status',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Stores</h2>
        </div>


        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stores..."
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
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="unapproved">Unapproved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {/* We'll populate this dynamically from API if needed */}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setLocationFilter("all")
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
                <TableHead>Store</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading stores...
                  </TableCell>
                </TableRow>
              ) : stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No stores found.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store: Store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={store.logo || "/placeholder.svg"}
                            alt={store.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {store.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{store.owner.name}</TableCell>
                    <TableCell>{store.address || "N/A"}</TableCell>
                    <TableCell>{store.stats.products}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-1">{store.stats.averageRating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={store.isApproved ? "default" : "secondary"}>
                          {store.isApproved ? "Approved" : "Unapproved"}
                        </Badge>
                        <Badge variant={!store.isBlocked ? "outline" : "destructive"}>
                          {!store.isBlocked ? "Active" : "Inactive"}
                        </Badge>
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
                              setCurrentStore({
                                ...store,
                                name: store.name,
                                description: store.description || "",
                                address: store.address || "",
                                phone: store.phone || "",
                                email: store.email || "",
                                isApproved: store.isApproved,
                                isBlocked: store.isBlocked,
                              })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Store
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleApproval(store)}>
                            {store.isApproved ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Unapprove
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActivation(store)}>
                            {store.isBlocked ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentStore(store)
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

      {/* Edit Store Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>Make changes to the store information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={currentStore?.image || "/placeholder.svg?height=64&width=64"}
                  alt={currentStore?.name || "Store"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentStore?.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {currentStore?.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Store Name</Label>
                <div className="relative">
                  <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={currentStore?.name || ""}
                    onChange={(e) => setCurrentStore({ ...currentStore, name: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input
                  id="edit-owner"
                  value={currentStore?.owner?.name || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-address"
                    value={currentStore?.address || ""}
                    onChange={(e) => setCurrentStore({ ...currentStore, address: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentStore?.email || ""}
                  onChange={(e) => setCurrentStore({ ...currentStore, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-phone"
                    value={currentStore?.phone || ""}
                    onChange={(e) => setCurrentStore({ ...currentStore, phone: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-approved">Approval Status</Label>
                <Select
                  value={currentStore?.isApproved ? "approved" : "unapproved"}
                  onValueChange={(value) => setCurrentStore({ ...currentStore, isApproved: value === "approved" })}
                >
                  <SelectTrigger id="edit-approved">
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="unapproved">Unapproved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-blocked">Block Status</Label>
                <Select
                  value={currentStore?.isBlocked ? "blocked" : "active"}
                  onValueChange={(value) => setCurrentStore({ ...currentStore, isBlocked: value === "blocked" })}
                >
                  <SelectTrigger id="edit-blocked">
                    <SelectValue placeholder="Select block status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentStore?.description || ""}
                onChange={(e) => setCurrentStore({ ...currentStore, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStore} disabled={isLoading}>
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

      {/* Delete Store Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this store? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentStore?.image || "/placeholder.svg?height=40&width=40"}
                alt={currentStore?.name || "Store"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentStore?.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentStore?.stats?.products || 0} products • {currentStore?.address || 'N/A'}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStore} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Store"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
