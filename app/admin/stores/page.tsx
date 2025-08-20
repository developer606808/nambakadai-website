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
} from "lucide-react"

// Mock data for stores
const mockStores = [
  {
    id: 1,
    name: "Green Farm",
    owner: "John Doe",
    location: "Tokyo",
    status: "active",
    productCount: 45,
    rating: 4.5,
    joinDate: "2023-01-15",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Orchard Fresh",
    owner: "Jane Smith",
    location: "Osaka",
    status: "active",
    productCount: 32,
    rating: 4.2,
    joinDate: "2023-02-20",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Happy Cows",
    owner: "Robert Johnson",
    location: "Kyoto",
    status: "inactive",
    productCount: 18,
    rating: 3.8,
    joinDate: "2023-03-10",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Grain Valley",
    owner: "Emily Davis",
    location: "Nagoya",
    status: "active",
    productCount: 27,
    rating: 4.7,
    joinDate: "2023-04-05",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Free Range Farms",
    owner: "Michael Wilson",
    location: "Sapporo",
    status: "active",
    productCount: 22,
    rating: 4.1,
    joinDate: "2023-05-12",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Ocean Fresh",
    owner: "Sarah Brown",
    location: "Fukuoka",
    status: "active",
    productCount: 15,
    rating: 4.3,
    joinDate: "2023-06-18",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Herb Garden",
    owner: "David Lee",
    location: "Yokohama",
    status: "inactive",
    productCount: 12,
    rating: 3.9,
    joinDate: "2023-07-22",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Nut House",
    owner: "Lisa Taylor",
    location: "Kobe",
    status: "active",
    productCount: 19,
    rating: 4.4,
    joinDate: "2023-08-30",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "Bee Happy",
    owner: "James Anderson",
    location: "Hiroshima",
    status: "active",
    productCount: 8,
    rating: 4.6,
    joinDate: "2023-09-14",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Mountain Dairy",
    owner: "Patricia Martin",
    location: "Sendai",
    status: "inactive",
    productCount: 14,
    rating: 3.7,
    joinDate: "2023-10-05",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function StoresPage() {
  const [stores, setStores] = useState(mockStores)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStore, setCurrentStore] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter stores based on search query and filters
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || store.status === statusFilter
    const matchesLocation = locationFilter === "all" || store.location === locationFilter

    return matchesSearch && matchesStatus && matchesLocation
  })

  const handleEditStore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStores = stores.map((store) =>
        store.id === currentStore.id ? { ...store, ...currentStore } : store,
      )
      setStores(updatedStores)
      setIsEditDialogOpen(false)
      setCurrentStore(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteStore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStores = stores.filter((store) => store.id !== currentStore.id)
      setStores(updatedStores)
      setIsDeleteDialogOpen(false)
      setCurrentStore(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleToggleStatus = (store: any) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStores = stores.map((s) =>
        s.id === store.id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s,
      )
      setStores(updatedStores)
      setIsLoading(false)
    }, 500)
  }

  // Get unique locations for filter
  const locations = Array.from(new Set(stores.map((store) => store.location)))

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
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
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
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No stores found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={store.image || "/placeholder.svg"}
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
                    <TableCell>{store.owner}</TableCell>
                    <TableCell>{store.location}</TableCell>
                    <TableCell>{store.productCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-1">{store.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.status === "active" ? "success" : "destructive"}>
                        {store.status === "active" ? "Active" : "Inactive"}
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
                              setCurrentStore(store)
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(store)}>
                            {store.status === "active" ? (
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

      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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

            <div className="grid grid-cols-2 gap-4">
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
                  value={currentStore?.owner || ""}
                  onChange={(e) => setCurrentStore({ ...currentStore, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-location"
                    value={currentStore?.location || ""}
                    onChange={(e) => setCurrentStore({ ...currentStore, location: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentStore?.status || ""}
                  onValueChange={(value) => setCurrentStore({ ...currentStore, status: value })}
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit-join-date">Join Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-join-date"
                    type="date"
                    value={currentStore?.joinDate || ""}
                    onChange={(e) => setCurrentStore({ ...currentStore, joinDate: e.target.value })}
                    className="pl-8"
                  />
                </div>
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
          <DialogFooter>
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

      {/* Delete Store Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                {currentStore?.productCount} products • {currentStore?.location}
              </p>
            </div>
          </div>
          <DialogFooter>
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
