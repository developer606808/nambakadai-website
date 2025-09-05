"use client"

import { useState, useEffect } from "react"
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
import { Plus, Search, MoreHorizontal, Edit, Trash, Building, Loader2, Filter } from "lucide-react"

interface City {
  id: number
  name_en: string
  name_hi?: string
  name_ta: string
  stateId: number
  createdAt: string
  updatedAt: string
  state: {
    id: number
    name_en: string
    name_ta: string
    stateCode: string
  }
  _count: {
    products: number
  }
}

interface State {
  id: number
  name_en: string
  name_ta: string
  stateCode: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([])
  const [states, setStates] = useState<State[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCity, setCurrentCity] = useState<City | null>(null)
  const [newCity, setNewCity] = useState({
    name_en: "",
    name_ta: "",
    name_hi: "",
    stateId: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch cities from API
  const fetchCities = async (page = 1, search = "", stateId = "all") => {
    try {
      setIsLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)
      if (stateId !== 'all') params.append('stateId', stateId)

      const response = await fetch(`/api/admin/cities?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cities')
      }

      setCities(data.cities)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching cities:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch cities')
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }

  // Fetch states for dropdown
  const fetchStates = async () => {
    try {
      const response = await fetch('/api/admin/states?page=1&limit=1000') // Get all states for dropdown
      const data = await response.json()

      if (response.ok) {
        setStates(data.states || [])
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchStates()
  }, [])

  // Load cities on component mount and when filters change
  useEffect(() => {
    fetchCities(pagination.page, searchQuery, stateFilter)
  }, [pagination.page, searchQuery, stateFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        fetchCities(1, searchQuery, stateFilter)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Form validation for cities
  const validateCityForm = (cityData: any) => {
    const errors: string[] = []

    if (!cityData?.name_en?.trim()) {
      errors.push('English name is required')
    }
    if (!cityData?.name_ta?.trim()) {
      errors.push('Tamil name is required')
    }
    if (!cityData?.stateId) {
      errors.push('State is required')
    }
    if (cityData?.name_en && cityData.name_en.length > 100) {
      errors.push('English name must be less than 100 characters')
    }
    if (cityData?.name_ta && cityData.name_ta.length > 100) {
      errors.push('Tamil name must be less than 100 characters')
    }
    if (cityData?.name_hi && cityData.name_hi.length > 100) {
      errors.push('Hindi name must be less than 100 characters')
    }

    return errors
  }

  const handleCreateCity = async () => {
    const validationErrors = validateCityForm(newCity)
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'))
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create city')
      }

      // Refresh cities list
      await fetchCities(pagination.page, searchQuery, stateFilter)
      setIsAddDialogOpen(false)
      setNewCity({
        name_en: "",
        name_ta: "",
        name_hi: "",
        stateId: "",
      })
    } catch (error) {
      console.error('Error creating city:', error)
      setError(error instanceof Error ? error.message : 'Failed to create city')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCity = async () => {
    const validationErrors = validateCityForm(currentCity)
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'))
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/cities/${currentCity!.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCity),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update city')
      }

      // Refresh cities list
      await fetchCities(pagination.page, searchQuery, stateFilter)
      setIsEditDialogOpen(false)
      setCurrentCity(null)
    } catch (error) {
      console.error('Error updating city:', error)
      setError(error instanceof Error ? error.message : 'Failed to update city')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCity = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/admin/cities/${currentCity!.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete city')
      }

      // Refresh cities list
      await fetchCities(pagination.page, searchQuery, stateFilter)
      setIsDeleteDialogOpen(false)
      setCurrentCity(null)
    } catch (error) {
      console.error('Error deleting city:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete city')
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
          <h2 className="text-3xl font-bold tracking-tight">Cities</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setNewCity({ name_en: "", name_ta: "", name_hi: "", stateId: "" })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          </div>
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
              placeholder="Search cities..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("")
                setStateFilter("all")
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
                <TableHead>English Name</TableHead>
                <TableHead>Tamil Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading cities...
                  </TableCell>
                </TableRow>
              ) : cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No cities found.
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city: City) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name_en}</TableCell>
                    <TableCell>{city.name_ta}</TableCell>
                    <TableCell>
                      <span className="font-medium">{city.state.name_en}</span>
                      <span className="text-muted-foreground ml-2">({city.state.stateCode})</span>
                    </TableCell>
                    <TableCell className="text-right">{city._count.products}</TableCell>
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
                              setCurrentCity({
                                ...city,
                                name_en: city.name_en,
                                name_ta: city.name_ta,
                                name_hi: city.name_hi || "",
                                stateId: city.stateId,
                              })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentCity(city)
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

        {pagination.totalPages > 1 && (
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

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
                    if (pagination.page < pagination.totalPages) handlePageChange(pagination.page + 1)
                  }}
                  className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Add City Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add City</DialogTitle>
            <DialogDescription>Create a new city.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name-en">English Name *</Label>
              <Input
                id="add-name-en"
                value={newCity.name_en}
                onChange={(e) => setNewCity({ ...newCity, name_en: e.target.value })}
                placeholder="City name in English"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-name-ta">Tamil Name *</Label>
              <Input
                id="add-name-ta"
                value={newCity.name_ta}
                onChange={(e) => setNewCity({ ...newCity, name_ta: e.target.value })}
                placeholder="City name in Tamil"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-name-hi">Hindi Name</Label>
              <Input
                id="add-name-hi"
                value={newCity.name_hi}
                onChange={(e) => setNewCity({ ...newCity, name_hi: e.target.value })}
                placeholder="City name in Hindi (optional)"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-state">State *</Label>
              <Select
                value={newCity.stateId}
                onValueChange={(value) => setNewCity({ ...newCity, stateId: value })}
              >
                <SelectTrigger id="add-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name_en} ({state.stateCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCity} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create City
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
            <DialogDescription>Make changes to the city information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name-en">English Name *</Label>
              <Input
                id="edit-name-en"
                value={currentCity?.name_en || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, name_en: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name-ta">Tamil Name *</Label>
              <Input
                id="edit-name-ta"
                value={currentCity?.name_ta || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, name_ta: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name-hi">Hindi Name</Label>
              <Input
                id="edit-name-hi"
                value={currentCity?.name_hi || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, name_hi: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-state">State *</Label>
              <Select
                value={currentCity?.stateId?.toString() || ""}
                onValueChange={(value) => setCurrentCity({ ...currentCity, stateId: value })}
              >
                <SelectTrigger id="edit-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name_en} ({state.stateCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCity} disabled={isLoading}>
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

      {/* Delete City Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete City</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this city? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentCity?.name_en}</p>
              <p className="text-sm text-muted-foreground">
                {currentCity?.state?.name_en} • {currentCity?._count?.products || 0} products
              </p>
            </div>
          </div>
          {(currentCity?._count?.products || 0) > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive font-medium">Warning!</p>
              <p className="text-sm text-destructive/80">
                This city has associated products. Deleting it may cause data integrity issues.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCity} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete City"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
