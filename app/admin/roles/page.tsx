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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Shield,
  Users,
  Settings,
  Loader2,
  Eye,
  ShoppingBasket,
  Store,
  Car,
  Tag,
  Ruler,
  MapPin,
  Building,
  FileText,
  Bell,
  Mail,
  CreditCard,
  BarChart3,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Define permissions
const allPermissions = [
  { id: "dashboard", name: "Dashboard", icon: <Shield className="h-4 w-4" />, category: "General" },
  { id: "users", name: "Users Management", icon: <Users className="h-4 w-4" />, category: "User Management" },
  {
    id: "products",
    name: "Products Management",
    icon: <ShoppingBasket className="h-4 w-4" />,
    category: "Content Management",
  },
  { id: "stores", name: "Stores Management", icon: <Store className="h-4 w-4" />, category: "Content Management" },
  { id: "rentals", name: "Rentals Management", icon: <Car className="h-4 w-4" />, category: "Content Management" },
  {
    id: "categories",
    name: "Categories Management",
    icon: <Tag className="h-4 w-4" />,
    category: "Content Management",
  },
  { id: "units", name: "Units Management", icon: <Ruler className="h-4 w-4" />, category: "Content Management" },
  {
    id: "banners",
    name: "Banners Management",
    icon: <ImageIcon className="h-4 w-4" />,
    category: "Content Management",
  },
  { id: "states", name: "States Management", icon: <MapPin className="h-4 w-4" />, category: "Location Management" },
  { id: "cities", name: "Cities Management", icon: <Building className="h-4 w-4" />, category: "Location Management" },
  { id: "roles", name: "Roles Management", icon: <Shield className="h-4 w-4" />, category: "System Management" },
  { id: "settings", name: "System Settings", icon: <Settings className="h-4 w-4" />, category: "System Management" },
  { id: "reports", name: "Reports", icon: <FileText className="h-4 w-4" />, category: "Analytics" },
  { id: "analytics", name: "Analytics", icon: <BarChart3 className="h-4 w-4" />, category: "Analytics" },
  { id: "notifications", name: "Notifications", icon: <Bell className="h-4 w-4" />, category: "Communication" },
  { id: "messages", name: "Messages", icon: <Mail className="h-4 w-4" />, category: "Communication" },
  { id: "payments", name: "Payments", icon: <CreditCard className="h-4 w-4" />, category: "Financial" },
]

// Define interfaces
interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  userCount: number
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Fetch roles from API
  const fetchRoles = async (page = 1, search = "", type = "all") => {
    try {
      setIsPageLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        type,
      })

      const response = await fetch(`/api/admin/roles?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles')
      }

      setRoles(data.roles)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch roles')
    } finally {
      setIsPageLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRoles()
  }, [])

  // Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRoles(1, searchQuery, typeFilter)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, typeFilter])

  const handleAddRole = async () => {
    if (!newRole.name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRole),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create role')
      }

      // Refresh the roles list
      await fetchRoles(pagination?.page || 1, searchQuery, typeFilter)
      setIsAddDialogOpen(false)
      setNewRole({ name: "", description: "", permissions: [] })
    } catch (error) {
      console.error('Error creating role:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditRole = async () => {
    if (!currentRole) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/roles/${currentRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentRole.name,
          description: currentRole.description,
          permissions: currentRole.permissions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role')
      }

      // Refresh the roles list
      await fetchRoles(pagination?.page || 1, searchQuery, typeFilter)
      setIsEditDialogOpen(false)
      setCurrentRole(null)
    } catch (error) {
      console.error('Error updating role:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRole = async () => {
    if (!currentRole) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/roles/${currentRole.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete role')
      }

      // Refresh the roles list
      await fetchRoles(pagination?.page || 1, searchQuery, typeFilter)
      setIsDeleteDialogOpen(false)
      setCurrentRole(null)
    } catch (error) {
      console.error('Error deleting role:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (permissionId: string, isNewRole = false) => {
    if (isNewRole) {
      const updatedPermissions = newRole.permissions.includes(permissionId)
        ? newRole.permissions.filter((p) => p !== permissionId)
        : [...newRole.permissions, permissionId]
      setNewRole({ ...newRole, permissions: updatedPermissions })
    } else if (currentRole) {
      const updatedPermissions = currentRole.permissions.includes(permissionId)
        ? currentRole.permissions.filter((p: string) => p !== permissionId)
        : [...currentRole.permissions, permissionId]
      setCurrentRole({ ...currentRole, permissions: updatedPermissions })
    }
  }

  const groupedPermissions = allPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof allPermissions>,
  )

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="system">System Roles</SelectItem>
              <SelectItem value="custom">Custom Roles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPageLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          {role.name}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{role.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {role.permissions.length} of {allPermissions.length} permissions
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(role.permissions.length / allPermissions.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? "secondary" : "outline"}>
                        {role.isSystem ? "System" : "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
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
                              setCurrentRole(role)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentRole(role)
                              setIsEditDialogOpen(true)
                            }}
                            disabled={role.isSystem}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentRole(role)
                              setIsDeleteDialogOpen(true)
                            }}
                            disabled={role.isSystem || (role.userCount ?? 0) > 0}
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

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} roles
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchRoles(pagination.page - 1, searchQuery, typeFilter)}
                disabled={pagination.page <= 1 || isPageLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i
                  if (pageNum > pagination.pages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchRoles(pageNum, searchQuery, typeFilter)}
                      disabled={isPageLoading}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchRoles(pagination.page + 1, searchQuery, typeFilter)}
                disabled={pagination.page >= pagination.pages || isPageLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specific permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Role Name</Label>
              <Input
                id="add-name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe the role and its responsibilities"
                rows={3}
              />
            </div>

            <div className="grid gap-4">
              <Label>Permissions</Label>
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`add-${permission.id}`}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id, true)}
                          />
                          <Label
                            htmlFor={`add-${permission.id}`}
                            className="text-sm font-normal flex items-center gap-2"
                          >
                            {permission.icon}
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole} disabled={isLoading || !newRole.name}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Modify role permissions and details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={currentRole?.name || ""}
                onChange={(e) => {
                  if (currentRole) {
                    setCurrentRole({ ...currentRole, name: e.target.value })
                  }
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentRole?.description || ""}
                onChange={(e) => {
                  if (currentRole) {
                    setCurrentRole({ ...currentRole, description: e.target.value })
                  }
                }}
                rows={3}
              />
            </div>

            <div className="grid gap-4">
              <Label>Permissions</Label>
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={currentRole?.permissions?.includes(permission.id) || false}
                            onCheckedChange={() => togglePermission(permission.id, false)}
                          />
                          <Label
                            htmlFor={`edit-${permission.id}`}
                            className="text-sm font-normal flex items-center gap-2"
                          >
                            {permission.icon}
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={isLoading}>
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

      {/* View Permissions Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Permissions</DialogTitle>
            <DialogDescription>
              Viewing permissions for <strong>{currentRole?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => {
                const categoryPermissions = permissions.filter((p) => currentRole?.permissions?.includes(p.id))

                if (categoryPermissions.length === 0) return null

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
                          {permission.icon}
                          <span className="text-sm">{permission.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <Shield className="h-8 w-8 text-primary" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentRole?.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentRole?.permissions?.length} permissions • {currentRole?.userCount} users
              </p>
            </div>
          </div>
          {(currentRole?.userCount ?? 0) > 0 && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              This role cannot be deleted because it is assigned to {currentRole?.userCount ?? 0} user(s).
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={isLoading || (currentRole?.userCount ?? 0) > 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
