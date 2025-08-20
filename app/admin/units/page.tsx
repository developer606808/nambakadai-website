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
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Edit, Trash, Ruler, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Mock data for categories
const mockCategories = [
  { id: 1, name: "Vegetables", type: "Store" },
  { id: 2, name: "Fruits", type: "Store" },
  { id: 3, name: "Grains", type: "Store" },
  { id: 4, name: "Dairy", type: "Store" },
  { id: 5, name: "Meat", type: "Store" },
  { id: 6, name: "Tractors", type: "Rentals" },
  { id: 7, name: "Tools", type: "Rentals" },
  { id: 8, name: "Equipment", type: "Rentals" },
]

// Mock data for units with categories
const mockUnits = [
  {
    id: 1,
    name: "Kilogram",
    abbreviation: "kg",
    description: "Metric unit of mass",
    categories: [1, 2, 3, 5], // Vegetables, Fruits, Grains, Meat
  },
  {
    id: 2,
    name: "Gram",
    abbreviation: "g",
    description: "Metric unit of mass",
    categories: [1, 2], // Vegetables, Fruits
  },
  {
    id: 3,
    name: "Liter",
    abbreviation: "L",
    description: "Metric unit of volume",
    categories: [4], // Dairy
  },
  {
    id: 4,
    name: "Milliliter",
    abbreviation: "mL",
    description: "Metric unit of volume",
    categories: [4], // Dairy
  },
  {
    id: 5,
    name: "Piece",
    abbreviation: "pc",
    description: "Count unit",
    categories: [1, 2, 6, 7, 8], // Vegetables, Fruits, Tractors, Tools, Equipment
  },
  {
    id: 6,
    name: "Bunch",
    abbreviation: "bunch",
    description: "Group of items",
    categories: [1, 2], // Vegetables, Fruits
  },
  {
    id: 7,
    name: "Box",
    abbreviation: "box",
    description: "Container unit",
    categories: [1, 2, 3], // Vegetables, Fruits, Grains
  },
  {
    id: 8,
    name: "Pound",
    abbreviation: "lb",
    description: "Imperial unit of mass",
    categories: [1, 2, 3, 5], // Vegetables, Fruits, Grains, Meat
  },
  {
    id: 9,
    name: "Ounce",
    abbreviation: "oz",
    description: "Imperial unit of mass",
    categories: [1, 2, 5], // Vegetables, Fruits, Meat
  },
  {
    id: 10,
    name: "Gallon",
    abbreviation: "gal",
    description: "Imperial unit of volume",
    categories: [4], // Dairy
  },
]

export default function UnitsPage() {
  const [units, setUnits] = useState(mockUnits)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [categories] = useState(mockCategories)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  // Filter units based on search query
  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUnit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newUnit = {
        id: units.length + 1,
        name: currentUnit.name,
        abbreviation: currentUnit.abbreviation,
        description: currentUnit.description,
        categories: currentUnit.categories || [],
      }
      setUnits([...units, newUnit])
      setIsAddDialogOpen(false)
      setCurrentUnit(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleEditUnit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUnits = units.map((unit) => (unit.id === currentUnit.id ? { ...unit, ...currentUnit } : unit))
      setUnits(updatedUnits)
      setIsEditDialogOpen(false)
      setCurrentUnit(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteUnit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUnits = units.filter((unit) => unit.id !== currentUnit.id)
      setUnits(updatedUnits)
      setIsDeleteDialogOpen(false)
      setCurrentUnit(null)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Units</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentUnit({ name: "", abbreviation: "", description: "", categories: [] })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search units..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Abbreviation</TableHead>
                <TableHead className="hidden md:table-cell">Categories</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No units found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.abbreviation}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {unit.categories.slice(0, 2).map((categoryId) => {
                          const category = categories.find((c) => c.id === categoryId)
                          return category ? (
                            <Badge key={categoryId} variant="secondary" className="text-xs">
                              {category.name}
                            </Badge>
                          ) : null
                        })}
                        {unit.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{unit.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{unit.description}</TableCell>
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
                              setCurrentUnit(unit)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentUnit(unit)
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
              <PaginationLink href="#">2</PaginationLink>
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

      {/* Add Unit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>Create a new measurement unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentUnit?.name || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name: e.target.value })}
                placeholder="Unit name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <Input
                id="abbreviation"
                value={currentUnit?.abbreviation || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, abbreviation: e.target.value })}
                placeholder="Unit abbreviation"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={currentUnit?.description || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, description: e.target.value })}
                placeholder="Unit description"
              />
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={isCategoryOpen} className="justify-between">
                    {currentUnit?.categories?.length > 0
                      ? `${currentUnit.categories.length} categories selected`
                      : "Select categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            onSelect={() => {
                              const currentCategories = currentUnit?.categories || []
                              const isSelected = currentCategories.includes(category.id)
                              const newCategories = isSelected
                                ? currentCategories.filter((id) => id !== category.id)
                                : [...currentCategories, category.id]
                              setCurrentUnit({ ...currentUnit, categories: newCategories })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentUnit?.categories?.includes(category.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex items-center justify-between w-full">
                              <span>{category.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {category.type}
                              </Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {currentUnit?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentUnit.categories.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId)
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="text-xs">
                        {category.name}
                        <button
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                          onClick={() => {
                            const newCategories = currentUnit.categories.filter((id) => id !== categoryId)
                            setCurrentUnit({ ...currentUnit, categories: newCategories })
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUnit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Unit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>Make changes to the measurement unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={currentUnit?.name || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-abbreviation">Abbreviation</Label>
              <Input
                id="edit-abbreviation"
                value={currentUnit?.abbreviation || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, abbreviation: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={currentUnit?.description || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={isCategoryOpen} className="justify-between">
                    {currentUnit?.categories?.length > 0
                      ? `${currentUnit.categories.length} categories selected`
                      : "Select categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            onSelect={() => {
                              const currentCategories = currentUnit?.categories || []
                              const isSelected = currentCategories.includes(category.id)
                              const newCategories = isSelected
                                ? currentCategories.filter((id) => id !== category.id)
                                : [...currentCategories, category.id]
                              setCurrentUnit({ ...currentUnit, categories: newCategories })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentUnit?.categories?.includes(category.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex items-center justify-between w-full">
                              <span>{category.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {category.type}
                              </Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {currentUnit?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentUnit.categories.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId)
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="text-xs">
                        {category.name}
                        <button
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                          onClick={() => {
                            const newCategories = currentUnit.categories.filter((id) => id !== categoryId)
                            setCurrentUnit({ ...currentUnit, categories: newCategories })
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUnit} disabled={isLoading}>
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

      {/* Delete Unit Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this unit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentUnit?.name}</p>
              <p className="text-sm text-muted-foreground">{currentUnit?.abbreviation}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Unit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
