// Define all available permissions
export const PERMISSIONS = {
  // General
  DASHBOARD: "dashboard",

  // User Management
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",

  // Content Management
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",

  STORES_VIEW: "stores.view",
  STORES_CREATE: "stores.create",
  STORES_EDIT: "stores.edit",
  STORES_DELETE: "stores.delete",

  RENTALS_VIEW: "rentals.view",
  RENTALS_CREATE: "rentals.create",
  RENTALS_EDIT: "rentals.edit",
  RENTALS_DELETE: "rentals.delete",

  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_EDIT: "categories.edit",
  CATEGORIES_DELETE: "categories.delete",

  UNITS_VIEW: "units.view",
  UNITS_CREATE: "units.create",
  UNITS_EDIT: "units.edit",
  UNITS_DELETE: "units.delete",

  BANNERS_VIEW: "banners.view",
  BANNERS_CREATE: "banners.create",
  BANNERS_EDIT: "banners.edit",
  BANNERS_DELETE: "banners.delete",

  // Location Management
  STATES_VIEW: "states.view",
  STATES_CREATE: "states.create",
  STATES_EDIT: "states.edit",
  STATES_DELETE: "states.delete",

  CITIES_VIEW: "cities.view",
  CITIES_CREATE: "cities.create",
  CITIES_EDIT: "cities.edit",
  CITIES_DELETE: "cities.delete",

  // System Management
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_EDIT: "roles.edit",
  ROLES_DELETE: "roles.delete",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",

  // Analytics
  REPORTS_VIEW: "reports.view",
  ANALYTICS_VIEW: "analytics.view",

  // Communication
  NOTIFICATIONS_VIEW: "notifications.view",
  NOTIFICATIONS_SEND: "notifications.send",

  MESSAGES_VIEW: "messages.view",
  MESSAGES_SEND: "messages.send",

  // Financial
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_MANAGE: "payments.manage",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Define admin roles
export interface AdminRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
}

export const DEFAULT_ROLES: AdminRole[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all system features and settings",
    permissions: Object.values(PERMISSIONS),
    isSystem: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Access to most features except system settings",
    permissions: Object.values(PERMISSIONS).filter((p) => !p.startsWith("roles.") && !p.startsWith("settings.")),
    isSystem: true,
  },
  {
    id: "content_manager",
    name: "Content Manager",
    description: "Manage products, stores, categories, and banners",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.STORES_VIEW,
      PERMISSIONS.STORES_EDIT,
      PERMISSIONS.CATEGORIES_VIEW,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_EDIT,
      PERMISSIONS.CATEGORIES_DELETE,
      PERMISSIONS.UNITS_VIEW,
      PERMISSIONS.UNITS_CREATE,
      PERMISSIONS.UNITS_EDIT,
      PERMISSIONS.UNITS_DELETE,
      PERMISSIONS.BANNERS_VIEW,
      PERMISSIONS.BANNERS_CREATE,
      PERMISSIONS.BANNERS_EDIT,
      PERMISSIONS.BANNERS_DELETE,
      PERMISSIONS.REPORTS_VIEW,
    ],
    isSystem: false,
  },
  {
    id: "customer_support",
    name: "Customer Support",
    description: "Handle user inquiries and basic content management",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.MESSAGES_VIEW,
      PERMISSIONS.MESSAGES_SEND,
      PERMISSIONS.NOTIFICATIONS_VIEW,
      PERMISSIONS.NOTIFICATIONS_SEND,
      PERMISSIONS.REPORTS_VIEW,
    ],
    isSystem: false,
  },
]

// Permission checking utility
export class PermissionChecker {
  private userPermissions: Permission[]

  constructor(userPermissions: Permission[]) {
    this.userPermissions = userPermissions
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions.includes(permission)
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  }

  canView(resource: string): boolean {
    return this.hasPermission(`${resource}.view` as Permission)
  }

  canCreate(resource: string): boolean {
    return this.hasPermission(`${resource}.create` as Permission)
  }

  canEdit(resource: string): boolean {
    return this.hasPermission(`${resource}.edit` as Permission)
  }

  canDelete(resource: string): boolean {
    return this.hasPermission(`${resource}.delete` as Permission)
  }
}

// Hook for using permissions in components
export function usePermissions(userPermissions: Permission[]) {
  return new PermissionChecker(userPermissions)
}
