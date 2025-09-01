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
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Edit, Trash, Ruler, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Define the Unit interface based on the API schema
interface Unit {
  id: number
  name_en: string
  name_ta: string
  name_hi?: string
  symbol: string
  _count?: {
    products: number
  }
  createdAt: string
  updatedAt: string
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<Partial<Unit> | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Fetch units from API
  const fetchUnits = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/admin/units?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}`
      )
      if (!response.ok) throw new Error('Failed to fetch units')

      const result = await response.json()
      if (result.success) {
        setUnits(result.data.units)
        setPagination(result.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load units on component mount and when dependencies change
  useEffect(() => {
    fetchUnits()
  }, [pagination.page, pagination.limit])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchUnits()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Form validation for units
  const validateUnitForm = () => {
    const errors: string[] = []

    if (!currentUnit?.name_en?.trim()) {
      errors.push('English name is required')
    }
    if (!currentUnit?.name_ta?.trim()) {
      errors.push('Tamil name is required')
    }
    if (!currentUnit?.symbol?.trim()) {
      errors.push('Symbol is required')
    }
    if (currentUnit?.name_en && currentUnit.name_en.length > 50) {
      errors.push('English name must be less than 50 characters')
    }
    if (currentUnit?.name_ta && currentUnit.name_ta.length > 50) {
      errors.push('Tamil name must be less than 50 characters')
    }
    if (currentUnit?.name_hi && currentUnit.name_hi.length > 50) {
      errors.push('Hindi name must be less than 50 characters')
    }
    if (currentUnit?.symbol && currentUnit.symbol.length > 10) {
      errors.push('Symbol must be less than 10 characters')
    }

    return errors
  }

  const handleAddUnit = async () => {
    const validationErrors = validateUnitForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_en: currentUnit!.name_en!.trim(),
          name_ta: currentUnit!.name_ta!.trim(),
          name_hi: currentUnit?.name_hi?.trim() || '',
          symbol: currentUnit!.symbol!.trim()
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create unit')
      }

      if (result.success) {
        setIsAddDialogOpen(false)
        setCurrentUnit(null)
        fetchUnits() // Refresh the list
        alert('Unit created successfully!')
      }
    } catch (error) {
      console.error('Error creating unit:', error)
      alert('Error creating unit: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUnit = async () => {
    if (!currentUnit?.id) return

    const validationErrors = validateUnitForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/units/${currentUnit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_en: currentUnit.name_en!.trim(),
          name_ta: currentUnit.name_ta!.trim(),
          name_hi: currentUnit.name_hi?.trim() || '',
          symbol: currentUnit.symbol!.trim()
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update unit')
      }

      if (result.success) {
        setIsEditDialogOpen(false)
        setCurrentUnit(null)
        fetchUnits() // Refresh the list
        alert('Unit updated successfully!')
      }
    } catch (error) {
      console.error('Error updating unit:', error)
      alert('Error updating unit: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUnit = async () => {
    if (!currentUnit?.id) return

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentUnit.name_en}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/units/${currentUnit.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete unit')
      }

      if (result.success) {
        setIsDeleteDialogOpen(false)
        setCurrentUnit(null)
        fetchUnits() // Refresh the list
        alert('Unit deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting unit:', error)
      alert('Error deleting unit: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
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
                <TableHead>Name (English)</TableHead>
                <TableHead>Name (Tamil)</TableHead>
                <TableHead className="hidden md:table-cell">Symbol</TableHead>
                <TableHead className="hidden lg:table-cell">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No units found.
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name_en}</TableCell>
                    <TableCell>{unit.name_ta}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="text-xs">
                        {unit.symbol}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {unit._count?.products || 0} products
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
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.hasPrev) {
                    setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                  }
                }}
                className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPagination(prev => ({ ...prev, page }))
                  }}
                  isActive={page === pagination.page}
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
                  if (pagination.hasNext) {
                    setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                  }
                }}
                className={!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Add Unit Dialog - Responsive */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>Create a new measurement unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name_en">Name (English)</Label>
              <Input
                id="name_en"
                value={currentUnit?.name_en || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_en: e.target.value })}
                placeholder="Unit name in English"
                required
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name_ta">Name (Tamil)</Label>
              <Input
                id="name_ta"
                value={currentUnit?.name_ta || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_ta: e.target.value })}
                placeholder="Unit name in Tamil"
                required
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name_hi">Name (Hindi)</Label>
              <Input
                id="name_hi"
                value={currentUnit?.name_hi || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_hi: e.target.value })}
                placeholder="Unit name in Hindi (optional)"
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={currentUnit?.symbol || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, symbol: e.target.value })}
                placeholder="Unit symbol (e.g., kg, L, m)"
                required
                maxLength={10}
              />
            </div>

          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
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

      {/* Edit Unit Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>Make changes to the measurement unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name_en">Name (English)</Label>
              <Input
                id="edit-name_en"
                value={currentUnit?.name_en || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_en: e.target.value })}
                required
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name_ta">Name (Tamil)</Label>
              <Input
                id="edit-name_ta"
                value={currentUnit?.name_ta || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_ta: e.target.value })}
                required
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name_hi">Name (Hindi)</Label>
              <Input
                id="edit-name_hi"
                value={currentUnit?.name_hi || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, name_hi: e.target.value })}
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input
                id="edit-symbol"
                value={currentUnit?.symbol || ""}
                onChange={(e) => setCurrentUnit({ ...currentUnit, symbol: e.target.value })}
                required
                maxLength={10}
              />
            </div>

          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
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

      {/* Delete Unit Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
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
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
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
