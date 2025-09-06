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
import { Plus, Search, MoreHorizontal, Edit, Trash, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface State {
  id: number
  name_en: string
  name_hi?: string
  name_ta: string
  stateCode: string
  createdAt: string
  updatedAt: string
  _count: {
    cities: number
    products: number
  }
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function StatesPage() {
  const { toast } = useToast()
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
  const [currentState, setCurrentState] = useState<any>(null)
  const [newState, setNewState] = useState({
    name_en: "",
    name_ta: "",
    name_hi: "",
    stateCode: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Fetch states from API
  const fetchStates = async (page = 1, search = "") => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/states?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch states')
      }

      setStates(data.states)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching states:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch states',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }

  // Load states on component mount and when search changes
  useEffect(() => {
    fetchStates(pagination.page, searchQuery)
  }, [pagination.page, searchQuery])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }))
      } else {
        fetchStates(1, searchQuery)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Form validation for states
  const validateStateForm = (stateData: any) => {
    const errors: string[] = []

    if (!stateData?.name_en?.trim()) {
      errors.push('English name is required')
    }
    if (!stateData?.name_ta?.trim()) {
      errors.push('Tamil name is required')
    }
    if (!stateData?.stateCode?.trim()) {
      errors.push('State code is required')
    }
    if (stateData?.name_en && stateData.name_en.length > 100) {
      errors.push('English name must be less than 100 characters')
    }
    if (stateData?.name_ta && stateData.name_ta.length > 100) {
      errors.push('Tamil name must be less than 100 characters')
    }
    if (stateData?.name_hi && stateData.name_hi.length > 100) {
      errors.push('Hindi name must be less than 100 characters')
    }
    if (stateData?.stateCode && stateData.stateCode.length > 10) {
      errors.push('State code must be less than 10 characters')
    }

    return errors
  }

  const handleCreateState = async () => {
    const validationErrors = validateStateForm(newState)
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join('\n'),
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch('/api/admin/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newState),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create state')
      }

      // Refresh states list
      await fetchStates(pagination.page, searchQuery)
      setIsAddDialogOpen(false)
      setNewState({
        name_en: "",
        name_ta: "",
        name_hi: "",
        stateCode: "",
      })

      toast({
        title: "Success",
        description: "State created successfully",
      })
    } catch (error) {
      console.error('Error creating state:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create state',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditState = async () => {
    const validationErrors = validateStateForm(currentState)
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join('\n'),
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(`/api/admin/states/${currentState.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentState),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update state')
      }

      // Refresh states list
      await fetchStates(pagination.page, searchQuery)
      setIsEditDialogOpen(false)
      setCurrentState(null)

      toast({
        title: "Success",
        description: "State updated successfully",
      })
    } catch (error) {
      console.error('Error updating state:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update state',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteState = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/admin/states/${currentState.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete state')
      }

      // Refresh states list
      await fetchStates(pagination.page, searchQuery)
      setIsDeleteDialogOpen(false)
      setCurrentState(null)

      toast({
        title: "Success",
        description: "State deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting state:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete state',
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
          <h2 className="text-3xl font-bold tracking-tight">States</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setNewState({ name_en: "", name_ta: "", name_hi: "", stateCode: "" })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add State
            </Button>
          </div>
        </div>


        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search states..."
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
                <TableHead>English Name</TableHead>
                <TableHead>Tamil Name</TableHead>
                <TableHead>State Code</TableHead>
                <TableHead className="text-right">Cities</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading states...
                  </TableCell>
                </TableRow>
              ) : states.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No states found.
                  </TableCell>
                </TableRow>
              ) : (
                states.map((state: State) => (
                  <TableRow key={state.id}>
                    <TableCell className="font-medium">{state.name_en}</TableCell>
                    <TableCell>{state.name_ta}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {state.stateCode}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{state._count.cities}</TableCell>
                    <TableCell className="text-right">{state._count.products}</TableCell>
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
                              setCurrentState({
                                ...state,
                                name_en: state.name_en,
                                name_ta: state.name_ta,
                                name_hi: state.name_hi || "",
                                stateCode: state.stateCode,
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
                              setCurrentState(state)
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

      {/* Add State Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add State</DialogTitle>
            <DialogDescription>Create a new state.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name-en">English Name *</Label>
              <Input
                id="add-name-en"
                value={newState.name_en}
                onChange={(e) => setNewState({ ...newState, name_en: e.target.value })}
                placeholder="State name in English"
                required
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-name-ta">Tamil Name *</Label>
              <Input
                id="add-name-ta"
                value={newState.name_ta}
                onChange={(e) => setNewState({ ...newState, name_ta: e.target.value })}
                placeholder="State name in Tamil"
                required
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-name-hi">Hindi Name</Label>
              <Input
                id="add-name-hi"
                value={newState.name_hi}
                onChange={(e) => setNewState({ ...newState, name_hi: e.target.value })}
                placeholder="State name in Hindi (optional)"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-state-code">State Code *</Label>
              <Input
                id="add-state-code"
                value={newState.stateCode}
                onChange={(e) => setNewState({ ...newState, stateCode: e.target.value.toUpperCase() })}
                placeholder="State code (e.g. TN, KL)"
                required
                maxLength={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateState} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create State
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit State Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit State</DialogTitle>
            <DialogDescription>Make changes to the state information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name-en">English Name *</Label>
              <Input
                id="edit-name-en"
                value={currentState?.name_en || ""}
                onChange={(e) => setCurrentState({ ...currentState, name_en: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name-ta">Tamil Name *</Label>
              <Input
                id="edit-name-ta"
                value={currentState?.name_ta || ""}
                onChange={(e) => setCurrentState({ ...currentState, name_ta: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name-hi">Hindi Name</Label>
              <Input
                id="edit-name-hi"
                value={currentState?.name_hi || ""}
                onChange={(e) => setCurrentState({ ...currentState, name_hi: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-state-code">State Code *</Label>
              <Input
                id="edit-state-code"
                value={currentState?.stateCode || ""}
                onChange={(e) => setCurrentState({ ...currentState, stateCode: e.target.value.toUpperCase() })}
                maxLength={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditState} disabled={isLoading}>
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

      {/* Delete State Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete State</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this state? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentState?.name_en}</p>
              <p className="text-sm text-muted-foreground">
                {currentState?._count?.cities || 0} cities • {currentState?._count?.products || 0} products
              </p>
            </div>
          </div>
          {(currentState?._count?.cities > 0 || currentState?._count?.products > 0) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive font-medium">Warning!</p>
              <p className="text-sm text-destructive/80">
                This state has associated cities and/or products. Deleting it may cause data integrity issues.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteState} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete State"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
