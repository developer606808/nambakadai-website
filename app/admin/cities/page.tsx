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

// Mock data for cities
const mockCities = [
  { id: 1, name: "Shinjuku", prefecture: "Tokyo", postalCode: "160-0022", population: 346235 },
  { id: 2, name: "Shibuya", prefecture: "Tokyo", postalCode: "150-0042", population: 228906 },
  { id: 3, name: "Osaka City", prefecture: "Osaka", postalCode: "530-0001", population: 2691742 },
  { id: 4, name: "Kyoto City", prefecture: "Kyoto", postalCode: "600-8216", population: 1459640 },
  { id: 5, name: "Sapporo", prefecture: "Hokkaido", postalCode: "060-0042", population: 1973832 },
  { id: 6, name: "Nagoya", prefecture: "Aichi", postalCode: "460-0008", population: 2320361 },
  { id: 7, name: "Yokohama", prefecture: "Kanagawa", postalCode: "220-0004", population: 3761630 },
  { id: 8, name: "Fukuoka City", prefecture: "Fukuoka", postalCode: "810-0001", population: 1588924 },
  { id: 9, name: "Kobe", prefecture: "Hyogo", postalCode: "650-0001", population: 1518870 },
  { id: 10, name: "Kawasaki", prefecture: "Kanagawa", postalCode: "210-0007", population: 1539522 },
]

// Prefecture list for dropdown
const prefectures = ["Tokyo", "Osaka", "Hokkaido", "Kyoto", "Fukuoka", "Aichi", "Kanagawa", "Saitama", "Chiba", "Hyogo"]

export default function CitiesPage() {
  const [cities, setCities] = useState(mockCities)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCity, setCurrentCity] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [prefectureFilter, setPrefectureFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter cities based on search query and prefecture filter
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.postalCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrefecture = prefectureFilter === "all" || city.prefecture === prefectureFilter

    return matchesSearch && matchesPrefecture
  })

  // Form validation for cities
  const validateCityForm = () => {
    const errors: string[] = []

    if (!currentCity?.name?.trim()) {
      errors.push('City name is required')
    }
    if (!currentCity?.prefecture?.trim()) {
      errors.push('Prefecture is required')
    }
    if (!currentCity?.postalCode?.trim()) {
      errors.push('Postal code is required')
    }
    if (currentCity?.name && currentCity.name.length > 50) {
      errors.push('City name must be less than 50 characters')
    }
    if (currentCity?.prefecture && currentCity.prefecture.length > 50) {
      errors.push('Prefecture must be less than 50 characters')
    }
    if (currentCity?.postalCode && currentCity.postalCode.length > 20) {
      errors.push('Postal code must be less than 20 characters')
    }
    if (currentCity?.population && (isNaN(Number(currentCity.population)) || Number(currentCity.population) < 0)) {
      errors.push('Population must be a valid positive number')
    }

    return errors
  }

  const handleAddCity = () => {
    const validationErrors = validateCityForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newCity = {
        id: cities.length + 1,
        name: currentCity.name.trim(),
        prefecture: currentCity.prefecture.trim(),
        postalCode: currentCity.postalCode.trim(),
        population: Number.parseInt(currentCity.population) || 0,
      }
      setCities([...cities, newCity])
      setIsAddDialogOpen(false)
      setCurrentCity(null)
      setIsLoading(false)
      alert('City added successfully!')
    }, 1000)
  }

  const handleEditCity = () => {
    const validationErrors = validateCityForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedCities = cities.map((city) =>
        city.id === currentCity.id ? {
          ...city,
          name: currentCity.name.trim(),
          prefecture: currentCity.prefecture.trim(),
          postalCode: currentCity.postalCode.trim(),
          population: Number.parseInt(currentCity.population) || 0
        } : city
      )
      setCities(updatedCities)
      setIsEditDialogOpen(false)
      setCurrentCity(null)
      setIsLoading(false)
      alert('City updated successfully!')
    }, 1000)
  }

  const handleDeleteCity = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentCity?.name}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedCities = cities.filter((city) => city.id !== currentCity.id)
      setCities(updatedCities)
      setIsDeleteDialogOpen(false)
      setCurrentCity(null)
      setIsLoading(false)
      alert('City deleted successfully!')
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Cities</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentCity({ name: "", prefecture: "", postalCode: "", population: "" })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          </div>
        </div>

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
            <Select value={prefectureFilter} onValueChange={setPrefectureFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prefecture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prefectures</SelectItem>
                {prefectures.map((prefecture) => (
                  <SelectItem key={prefecture} value={prefecture}>
                    {prefecture}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("")
                setPrefectureFilter("all")
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
                <TableHead>City Name</TableHead>
                <TableHead>Prefecture</TableHead>
                <TableHead>Postal Code</TableHead>
                <TableHead className="text-right">Population</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No cities found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>{city.prefecture}</TableCell>
                    <TableCell>{city.postalCode}</TableCell>
                    <TableCell className="text-right">{city.population.toLocaleString()}</TableCell>
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
                              setCurrentCity(city)
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

      {/* Add City Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add City</DialogTitle>
            <DialogDescription>Create a new city.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">City Name</Label>
              <Input
                id="name"
                value={currentCity?.name || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, name: e.target.value })}
                placeholder="City name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prefecture">Prefecture</Label>
              <Select
                value={currentCity?.prefecture || ""}
                onValueChange={(value) => setCurrentCity({ ...currentCity, prefecture: value })}
              >
                <SelectTrigger id="prefecture">
                  <SelectValue placeholder="Select prefecture" />
                </SelectTrigger>
                <SelectContent>
                  {prefectures.map((prefecture) => (
                    <SelectItem key={prefecture} value={prefecture}>
                      {prefecture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={currentCity?.postalCode || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, postalCode: e.target.value })}
                placeholder="e.g. 100-0001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="population">Population</Label>
              <Input
                id="population"
                type="number"
                value={currentCity?.population || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, population: e.target.value })}
                placeholder="Population count"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCity} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add City
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
            <DialogDescription>Make changes to the city information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">City Name</Label>
              <Input
                id="edit-name"
                value={currentCity?.name || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-prefecture">Prefecture</Label>
              <Select
                value={currentCity?.prefecture || ""}
                onValueChange={(value) => setCurrentCity({ ...currentCity, prefecture: value })}
              >
                <SelectTrigger id="edit-prefecture">
                  <SelectValue placeholder="Select prefecture" />
                </SelectTrigger>
                <SelectContent>
                  {prefectures.map((prefecture) => (
                    <SelectItem key={prefecture} value={prefecture}>
                      {prefecture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-postalCode">Postal Code</Label>
              <Input
                id="edit-postalCode"
                value={currentCity?.postalCode || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, postalCode: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-population">Population</Label>
              <Input
                id="edit-population"
                type="number"
                value={currentCity?.population || ""}
                onChange={(e) => setCurrentCity({ ...currentCity, population: e.target.value })}
              />
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
              <p className="text-sm font-medium leading-none">{currentCity?.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentCity?.prefecture} • {currentCity?.postalCode}
              </p>
            </div>
          </div>
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
