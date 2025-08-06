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
  Car,
  MapPin,
  DollarSign,
} from "lucide-react"

// Mock data for rentals
const mockRentals = [
  {
    id: 1,
    name: "Tractor - John Deere",
    owner: "Green Farm",
    location: "Tokyo",
    status: "available",
    price: 15000,
    type: "Tractor",
    rating: 4.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Harvester - New Holland",
    owner: "Orchard Fresh",
    location: "Osaka",
    status: "available",
    price: 25000,
    type: "Harvester",
    rating: 4.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Pickup Truck - Toyota",
    owner: "Happy Cows",
    location: "Kyoto",
    status: "rented",
    price: 8000,
    type: "Truck",
    rating: 3.8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Mini Excavator",
    owner: "Grain Valley",
    location: "Nagoya",
    status: "available",
    price: 12000,
    type: "Excavator",
    rating: 4.7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "ATV - Honda",
    owner: "Free Range Farms",
    location: "Sapporo",
    status: "maintenance",
    price: 5000,
    type: "ATV",
    rating: 4.1,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Utility Vehicle - Kubota",
    owner: "Ocean Fresh",
    location: "Fukuoka",
    status: "available",
    price: 7500,
    type: "Utility Vehicle",
    rating: 4.3,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Sprayer - John Deere",
    owner: "Herb Garden",
    location: "Yokohama",
    status: "rented",
    price: 9000,
    type: "Sprayer",
    rating: 3.9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Trailer - Heavy Duty",
    owner: "Nut House",
    location: "Kobe",
    status: "available",
    price: 6000,
    type: "Trailer",
    rating: 4.4,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "Compact Tractor - Kubota",
    owner: "Bee Happy",
    location: "Hiroshima",
    status: "available",
    price: 10000,
    type: "Tractor",
    rating: 4.6,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Forklift - Toyota",
    owner: "Mountain Dairy",
    location: "Sendai",
    status: "maintenance",
    price: 8500,
    type: "Forklift",
    rating: 3.7,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function RentalsPage() {
  const [rentals, setRentals] = useState(mockRentals)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRental, setCurrentRental] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter rentals based on search query and filters
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || rental.status === statusFilter
    const matchesType = typeFilter === "all" || rental.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleEditRental = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedRentals = rentals.map((rental) =>
        rental.id === currentRental.id ? { ...rental, ...currentRental } : rental,
      )
      setRentals(updatedRentals)
      setIsEditDialogOpen(false)
      setCurrentRental(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteRental = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedRentals = rentals.filter((rental) => rental.id !== currentRental.id)
      setRentals(updatedRentals)
      setIsDeleteDialogOpen(false)
      setCurrentRental(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleChangeStatus = (rental: any, newStatus: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedRentals = rentals.map((r) => (r.id === rental.id ? { ...r, status: newStatus } : r))
      setRentals(updatedRentals)
      setIsLoading(false)
    }, 500)
  }

  // Get unique types for filter
  const types = Array.from(new Set(rentals.map((rental) => rental.type)))

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "success"
      case "rented":
        return "warning"
      case "maintenance":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Rental Vehicles</h2>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rentals..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  setTypeFilter("all")
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
                <TableHead>Vehicle</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No rentals found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={rental.image || "/placeholder.svg"}
                            alt={rental.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{rental.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {rental.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{rental.owner}</TableCell>
                    <TableCell>{rental.location}</TableCell>
                    <TableCell>{rental.type}</TableCell>
                    <TableCell>¥{rental.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(rental.status)}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
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
                              setCurrentRental(rental)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {rental.status !== "available" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(rental, "available")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Available
                            </DropdownMenuItem>
                          )}
                          {rental.status !== "rented" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(rental, "rented")}>
                              <Car className="mr-2 h-4 w-4" />
                              Mark Rented
                            </DropdownMenuItem>
                          )}
                          {rental.status !== "maintenance" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(rental, "maintenance")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark Maintenance
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentRental(rental)
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

      {/* Edit Rental Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Rental Vehicle</DialogTitle>
            <DialogDescription>Make changes to the rental vehicle information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={currentRental?.image || "/placeholder.svg?height=64&width=64"}
                  alt={currentRental?.name || "Rental"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentRental?.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {currentRental?.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Vehicle Name</Label>
                <div className="relative">
                  <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={currentRental?.name || ""}
                    onChange={(e) => setCurrentRental({ ...currentRental, name: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input
                  id="edit-owner"
                  value={currentRental?.owner || ""}
                  onChange={(e) => setCurrentRental({ ...currentRental, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={currentRental?.type || ""}
                  onValueChange={(value) => setCurrentRental({ ...currentRental, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentRental?.status || ""}
                  onValueChange={(value) => setCurrentRental({ ...currentRental, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price per Day</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price"
                    type="number"
                    value={currentRental?.price || ""}
                    onChange={(e) => setCurrentRental({ ...currentRental, price: Number.parseInt(e.target.value) })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-location"
                    value={currentRental?.location || ""}
                    onChange={(e) => setCurrentRental({ ...currentRental, location: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentRental?.description || ""}
                onChange={(e) => setCurrentRental({ ...currentRental, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRental} disabled={isLoading}>
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

      {/* Delete Rental Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Rental Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rental vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentRental?.image || "/placeholder.svg?height=40&width=40"}
                alt={currentRental?.name || "Rental"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentRental?.name}</p>
              <p className="text-sm text-muted-foreground">
                ¥{currentRental?.price?.toLocaleString()} per day • {currentRental?.type}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRental} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Rental"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
