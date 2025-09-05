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
  Car,
  MapPin,
  DollarSign,
} from "lucide-react"

interface Vehicle {
  id: number
  name: string
  description?: string
  type: string
  category: string
  pricePerDay: number | null
  pricePerHour: number
  capacity: string
  fuelType: string
  location: string
  features: string[]
  images: string[]
  status: string
  rating: number
  totalBookings: number
  adId: string
  createdAt: string
  updatedAt: string
  owner: {
    id: number
    name: string
    email: string
    store: string
  }
  currentBooking: any | null
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function RentalsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch vehicles from API
  const fetchVehicles = async (page = 1, search = "", status = "all", type = "all", fuelType = "all") => {
    try {
      setIsLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)
      if (status !== 'all') params.append('status', status)
      if (type !== 'all') params.append('type', type)
      if (fuelType !== 'all') params.append('fuelType', fuelType)

      const response = await fetch(`/api/admin/vehicles?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vehicles')
      }

      setVehicles(data.vehicles)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch vehicles')
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }

  // Load vehicles on component mount and when filters change
  useEffect(() => {
    fetchVehicles(pagination.page, searchQuery, statusFilter, typeFilter, fuelTypeFilter)
  }, [pagination.page, searchQuery, statusFilter, typeFilter, fuelTypeFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        fetchVehicles(1, searchQuery, statusFilter, typeFilter, fuelTypeFilter)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleEditVehicle = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/vehicles/${currentVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentVehicle),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update vehicle')
      }

      // Refresh vehicles list
      await fetchVehicles(pagination.page, searchQuery, statusFilter, typeFilter, fuelTypeFilter)
      setIsEditDialogOpen(false)
      setCurrentVehicle(null)
    } catch (error) {
      console.error('Error updating vehicle:', error)
      setError(error instanceof Error ? error.message : 'Failed to update vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVehicle = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/vehicles/${currentVehicle.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete vehicle')
      }

      // Refresh vehicles list
      await fetchVehicles(pagination.page, searchQuery, statusFilter, typeFilter, fuelTypeFilter)
      setIsDeleteDialogOpen(false)
      setCurrentVehicle(null)
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (vehicle: Vehicle, newStatus: string) => {
    try {
      setIsLoading(true)
      setError("")

      const updateData = {
        name: vehicle.name,
        description: vehicle.description,
        type: vehicle.type,
        category: vehicle.category,
        pricePerDay: vehicle.pricePerDay,
        pricePerHour: vehicle.pricePerHour,
        capacity: vehicle.capacity,
        fuelType: vehicle.fuelType,
        location: vehicle.location,
        features: vehicle.features,
        status: newStatus,
      }

      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update vehicle status')
      }

      // Refresh vehicles list
      await fetchVehicles(pagination.page, searchQuery, statusFilter, typeFilter, fuelTypeFilter)
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      setError(error instanceof Error ? error.message : 'Failed to update vehicle status')
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
    setTypeFilter("all")
    setFuelTypeFilter("all")
  }

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

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vehicles..."
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
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="RENTED">Rented</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TRACTOR">Tractor</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                  <SelectItem value="LORRY">Lorry</SelectItem>
                  <SelectItem value="VAN">Van</SelectItem>
                  <SelectItem value="HARVESTING_MACHINE">Harvesting Machine</SelectItem>
                  <SelectItem value="PLANTING_MACHINE">Planting Machine</SelectItem>
                  <SelectItem value="THRESHING_MACHINE">Threshing Machine</SelectItem>
                  <SelectItem value="CULTIVATOR">Cultivator</SelectItem>
                  <SelectItem value="PLOUGH">Plough</SelectItem>
                  <SelectItem value="SPRAYER">Sprayer</SelectItem>
                  <SelectItem value="TRAILER">Trailer</SelectItem>
                  <SelectItem value="OTHER_EQUIPMENT">Other Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="PETROL">Petrol</SelectItem>
                  <SelectItem value="DIESEL">Diesel</SelectItem>
                  <SelectItem value="ELECTRIC">Electric</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
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
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading vehicles...
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle: Vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={vehicle.images[0] || "/placeholder.svg"}
                            alt={vehicle.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {vehicle.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.owner.name}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.owner.store}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {vehicle.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{vehicle.pricePerDay?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.status === "AVAILABLE" ? "default" : vehicle.status === "RENTED" ? "secondary" : "destructive"}>
                        {vehicle.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
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
                              setCurrentVehicle({
                                ...vehicle,
                                name: vehicle.name,
                                description: vehicle.description || "",
                                type: vehicle.type,
                                category: vehicle.category,
                                pricePerDay: vehicle.pricePerDay,
                                pricePerHour: vehicle.pricePerHour,
                                capacity: vehicle.capacity,
                                fuelType: vehicle.fuelType,
                                location: vehicle.location,
                                features: vehicle.features,
                                status: vehicle.status,
                              })
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
                          {vehicle.status !== "AVAILABLE" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(vehicle, "AVAILABLE")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Available
                            </DropdownMenuItem>
                          )}
                          {vehicle.status !== "RENTED" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(vehicle, "RENTED")}>
                              <Car className="mr-2 h-4 w-4" />
                              Mark Rented
                            </DropdownMenuItem>
                          )}
                          {vehicle.status !== "MAINTENANCE" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(vehicle, "MAINTENANCE")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark Maintenance
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentVehicle(vehicle)
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

      {/* Edit Vehicle Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Rental Vehicle</DialogTitle>
            <DialogDescription>Make changes to the rental vehicle information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={currentVehicle?.images?.[0] || "/placeholder.svg?height=64&width=64"}
                  alt={currentVehicle?.name || "Vehicle"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentVehicle?.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {currentVehicle?.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Vehicle Name</Label>
                <div className="relative">
                  <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={currentVehicle?.name || ""}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, name: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input
                  id="edit-owner"
                  value={currentVehicle?.owner?.name || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={currentVehicle?.type || ""}
                  onValueChange={(value) => setCurrentVehicle({ ...currentVehicle, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRACTOR">Tractor</SelectItem>
                    <SelectItem value="TRUCK">Truck</SelectItem>
                    <SelectItem value="LORRY">Lorry</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="HARVESTING_MACHINE">Harvesting Machine</SelectItem>
                    <SelectItem value="PLANTING_MACHINE">Planting Machine</SelectItem>
                    <SelectItem value="THRESHING_MACHINE">Threshing Machine</SelectItem>
                    <SelectItem value="CULTIVATOR">Cultivator</SelectItem>
                    <SelectItem value="PLOUGH">Plough</SelectItem>
                    <SelectItem value="SPRAYER">Sprayer</SelectItem>
                    <SelectItem value="TRAILER">Trailer</SelectItem>
                    <SelectItem value="OTHER_EQUIPMENT">Other Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentVehicle?.status || ""}
                  onValueChange={(value) => setCurrentVehicle({ ...currentVehicle, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price-day">Price per Day</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price-day"
                    type="number"
                    value={currentVehicle?.pricePerDay || ""}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, pricePerDay: Number.parseFloat(e.target.value) || null })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price-hour">Price per Hour</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price-hour"
                    type="number"
                    value={currentVehicle?.pricePerHour || ""}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, pricePerHour: Number.parseFloat(e.target.value) })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  value={currentVehicle?.capacity || ""}
                  onChange={(e) => setCurrentVehicle({ ...currentVehicle, capacity: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fuel-type">Fuel Type</Label>
                <Select
                  value={currentVehicle?.fuelType || ""}
                  onValueChange={(value) => setCurrentVehicle({ ...currentVehicle, fuelType: value })}
                >
                  <SelectTrigger id="edit-fuel-type">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETROL">Petrol</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="ELECTRIC">Electric</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-location"
                  value={currentVehicle?.location || ""}
                  onChange={(e) => setCurrentVehicle({ ...currentVehicle, location: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentVehicle?.description || ""}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditVehicle} disabled={isLoading}>
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

      {/* Delete Vehicle Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Rental Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rental vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentVehicle?.images?.[0] || "/placeholder.svg?height=40&width=40"}
                alt={currentVehicle?.name || "Vehicle"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentVehicle?.name}</p>
              <p className="text-sm text-muted-foreground">
                ₹{currentVehicle?.pricePerDay?.toLocaleString() || 'N/A'} per day • {currentVehicle?.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVehicle} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Vehicle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
