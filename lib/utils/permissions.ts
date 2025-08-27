import { Role } from '@prisma/client';

export type Permission = 
  | 'read:products'
  | 'write:products'
  | 'read:stores'
  | 'write:stores'
  | 'read:users'
  | 'write:users'
  | 'read:reports'
  | 'write:reports'
  | 'read:admin'
  | 'write:admin';

export const rolePermissions: Record<Role, Permission[]> = {
  BUYER: [
    'read:products',
    'read:stores'
  ],
  SELLER: [
    'read:products',
    'write:products',
    'read:stores',
    'write:stores'
  ],
  ADMIN: [
    'read:products',
    'write:products',
    'read:stores',
    'write:stores',
    'read:users',
    'write:users',
    'read:reports',
    'write:reports',
    'read:admin',
    'write:admin'
  ]
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  // ADMIN can access everything
  if (userRole === 'ADMIN') return true;
  
  // SELLER can access BUYER and SELLER resources
  if (userRole === 'SELLER' && requiredRole !== 'ADMIN') return true;
  
  // Exact match
  return userRole === requiredRole;
}