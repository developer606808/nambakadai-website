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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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

// Mock data for roles
const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all system features and settings",
    permissions: allPermissions.map((p) => p.id),
    userCount: 2,
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Admin",
    description: "Access to most features except system settings",
    permissions: allPermissions.filter((p) => p.id !== "roles" && p.id !== "settings").map((p) => p.id),
    userCount: 5,
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    name: "Content Manager",
    description: "Manage products, stores, categories, and banners",
    permissions: ["dashboard", "products", "stores", "categories", "units", "banners", "reports"],
    userCount: 8,
    isSystem: false,
    createdAt: "2024-02-15",
  },
  {
    id: 4,
    name: "Customer Support",
    description: "Handle user inquiries and basic content management",
    permissions: ["dashboard", "users", "messages", "notifications", "reports"],
    userCount: 12,
    isSystem: false,
    createdAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Analytics Manager",
    description: "Access to analytics and reporting features",
    permissions: ["dashboard", "reports", "analytics", "payments"],
    userCount: 3,
    isSystem: false,
    createdAt: "2024-04-10",
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Filter roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddRole = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const role = {
        ...newRole,
        id: roles.length + 1,
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setRoles([...roles, role])
      setIsAddDialogOpen(false)
      setNewRole({ name: "", description: "", permissions: [] })
      setIsLoading(false)
    }, 1000)
  }

  const handleEditRole = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedRoles = roles.map((role) => (role.id === currentRole.id ? { ...role, ...currentRole } : role))
      setRoles(updatedRoles)
      setIsEditDialogOpen(false)
      setCurrentRole(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteRole = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedRoles = roles.filter((role) => role.id !== currentRole.id)
      setRoles(updatedRoles)
      setIsDeleteDialogOpen(false)
      setCurrentRole(null)
      setIsLoading(false)
    }, 1000)
  }

  const togglePermission = (permissionId: string, isNewRole = false) => {
    if (isNewRole) {
      const updatedPermissions = newRole.permissions.includes(permissionId)
        ? newRole.permissions.filter((p) => p !== permissionId)
        : [...newRole.permissions, permissionId]
      setNewRole({ ...newRole, permissions: updatedPermissions })
    } else {
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
        </div>

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
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
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
                    <TableCell>{role.createdAt}</TableCell>
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
                            disabled={role.isSystem || role.userCount > 0}
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
                onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentRole?.description || ""}
                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
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
          {currentRole?.userCount > 0 && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              This role cannot be deleted because it is assigned to {currentRole.userCount} user(s).
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={isLoading || currentRole?.userCount > 0}>
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
