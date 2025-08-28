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
import { Plus, Search, MoreHorizontal, Edit, Trash, MapPin, Loader2 } from "lucide-react"

// Mock data for states (Japanese prefectures)
const mockStates = [
  { id: 1, name: "Tokyo", code: "TK", region: "Kanto", cityCount: 23 },
  { id: 2, name: "Osaka", code: "OS", region: "Kansai", cityCount: 33 },
  { id: 3, name: "Hokkaido", code: "HK", region: "Hokkaido", cityCount: 35 },
  { id: 4, name: "Kyoto", code: "KY", region: "Kansai", cityCount: 11 },
  { id: 5, name: "Fukuoka", code: "FK", region: "Kyushu", cityCount: 28 },
  { id: 6, name: "Aichi", code: "AI", region: "Chubu", cityCount: 38 },
  { id: 7, name: "Kanagawa", code: "KN", region: "Kanto", cityCount: 19 },
  { id: 8, name: "Saitama", code: "ST", region: "Kanto", cityCount: 40 },
  { id: 9, name: "Chiba", code: "CB", region: "Kanto", cityCount: 37 },
  { id: 10, name: "Hyogo", code: "HG", region: "Kansai", cityCount: 29 },
]

export default function StatesPage() {
  const [states, setStates] = useState(mockStates)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentState, setCurrentState] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Filter states based on search query
  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Form validation for states
  const validateStateForm = () => {
    const errors: string[] = []

    if (!currentState?.name?.trim()) {
      errors.push('State name is required')
    }
    if (!currentState?.code?.trim()) {
      errors.push('State code is required')
    }
    if (!currentState?.region?.trim()) {
      errors.push('Region is required')
    }
    if (currentState?.name && currentState.name.length > 50) {
      errors.push('State name must be less than 50 characters')
    }
    if (currentState?.code && currentState.code.length > 10) {
      errors.push('State code must be less than 10 characters')
    }
    if (currentState?.region && currentState.region.length > 50) {
      errors.push('Region must be less than 50 characters')
    }

    return errors
  }

  const handleAddState = () => {
    const validationErrors = validateStateForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newState = {
        id: states.length + 1,
        name: currentState.name.trim(),
        code: currentState.code.trim(),
        region: currentState.region.trim(),
        cityCount: 0,
      }
      setStates([...states, newState])
      setIsAddDialogOpen(false)
      setCurrentState(null)
      setIsLoading(false)
      alert('State added successfully!')
    }, 1000)
  }

  const handleEditState = () => {
    const validationErrors = validateStateForm()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStates = states.map((state) =>
        state.id === currentState.id ? {
          ...state,
          name: currentState.name.trim(),
          code: currentState.code.trim(),
          region: currentState.region.trim()
        } : state,
      )
      setStates(updatedStates)
      setIsEditDialogOpen(false)
      setCurrentState(null)
      setIsLoading(false)
      alert('State updated successfully!')
    }, 1000)
  }

  const handleDeleteState = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentState?.name}"?\n\nThis action cannot be undone and will affect all cities in this state.`
    )

    if (!confirmed) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStates = states.filter((state) => state.id !== currentState.id)
      setStates(updatedStates)
      setIsDeleteDialogOpen(false)
      setCurrentState(null)
      setIsLoading(false)
      alert('State deleted successfully!')
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">States/Prefectures</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentState({ name: "", code: "", region: "" })
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Prefecture
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prefectures..."
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
                <TableHead>Code</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Cities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No prefectures found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStates.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell className="font-medium">{state.name}</TableCell>
                    <TableCell>{state.code}</TableCell>
                    <TableCell>{state.region}</TableCell>
                    <TableCell className="text-right">{state.cityCount}</TableCell>
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
                              setCurrentState(state)
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

      {/* Add State Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Prefecture</DialogTitle>
            <DialogDescription>Create a new prefecture/state.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentState?.name || ""}
                onChange={(e) => setCurrentState({ ...currentState, name: e.target.value })}
                placeholder="Prefecture name"
                required
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={currentState?.code || ""}
                onChange={(e) => setCurrentState({ ...currentState, code: e.target.value })}
                placeholder="Prefecture code (e.g. TK)"
                required
                maxLength={10}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={currentState?.region || ""}
                onChange={(e) => setCurrentState({ ...currentState, region: e.target.value })}
                placeholder="Region name"
                required
                maxLength={50}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddState} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prefecture
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit State Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Prefecture</DialogTitle>
            <DialogDescription>Make changes to the prefecture/state.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={currentState?.name || ""}
                onChange={(e) => setCurrentState({ ...currentState, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Code</Label>
              <Input
                id="edit-code"
                value={currentState?.code || ""}
                onChange={(e) => setCurrentState({ ...currentState, code: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-region">Region</Label>
              <Input
                id="edit-region"
                value={currentState?.region || ""}
                onChange={(e) => setCurrentState({ ...currentState, region: e.target.value })}
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
            <DialogTitle>Delete Prefecture</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prefecture? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentState?.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentState?.cityCount} cities • {currentState?.region} region
              </p>
            </div>
          </div>
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
                "Delete Prefecture"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
