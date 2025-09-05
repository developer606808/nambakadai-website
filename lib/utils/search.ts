import { Prisma } from '@prisma/client';

export type FilterOptions = {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  state?: number;
  city?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export function buildFilterWhereClause(filters: FilterOptions): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  
  if (filters.category) {
    where.categoryId = filters.category;
  }
  
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }
  
  if (filters.state) {
    where.stateId = filters.state;
  }
  
  if (filters.city) {
    where.cityId = filters.city;
  }
  
  return where;
}

export function buildOrderByClause(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): Prisma.ProductOrderByWithRelationInput {
  if (!sortBy) {
    return { createdAt: sortOrder };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  (orderBy as Record<string, 'asc' | 'desc'>)[sortBy] = sortOrder;
  return orderBy;
}

export function sanitizeSearchQuery(query: string): string {
  // Remove special characters and extra whitespace
  return query
    .replace(/[^\w\s\u0B80-\u0BFF]/g, '') // Allow Tamil characters
    .replace(/\s+/g, ' ')
    .trim();
}