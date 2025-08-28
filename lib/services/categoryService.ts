import { prisma } from '@/lib/prisma'

export interface CategoryWithCounts {
  id: number
  name_en: string
  name_ta: string
  name_hi?: string
  slug: string
  image?: string
  type: 'STORE' | 'RENTAL'
  _count?: {
    products: number
  }
}

export async function getActiveCategories(type?: 'STORE' | 'RENTAL', limit: number = 12): Promise<CategoryWithCounts[]> {
  try {
    const where: any = {
      parentId: null, // Only get root categories for the carousel
    }

    if (type) {
      where.type = type
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { name_en: 'asc' } // Order alphabetically for now
      ],
      take: limit,
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCounts | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug }
    })

    return category
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

// Generate category icon based on category name (fallback for categories without images)
export function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'vegetables': '🥦',
    'fruits': '🍎',
    'dairy': '🥛',
    'grains': '🌾',
    'meat': '🥩',
    'seafood': '🐟',
    'organic': '🌱',
    'herbs': '🌿',
    'spices': '🌶️',
    'nuts': '🥜',
    'beverages': '🥤',
    'bakery': '🍞',
    'snacks': '🍿',
    'frozen': '🧊',
    'canned': '🥫',
    'condiments': '🍯',
    'oil': '🫒',
    'rice': '🍚',
    'flour': '🌾',
    'sugar': '🍯',
  }

  const key = categoryName.toLowerCase()
  return iconMap[key] || '📦'
}

// Generate category background color based on category type
export function getCategoryBgColor(categoryName: string, type: 'STORE' | 'RENTAL'): string {
  if (type === 'RENTAL') {
    return 'bg-blue-50'
  }

  const colorMap: Record<string, string> = {
    'vegetables': 'bg-green-50',
    'fruits': 'bg-red-50',
    'dairy': 'bg-yellow-50',
    'grains': 'bg-amber-50',
    'meat': 'bg-red-100',
    'seafood': 'bg-blue-50',
    'organic': 'bg-emerald-50',
    'herbs': 'bg-green-100',
    'spices': 'bg-orange-50',
    'nuts': 'bg-yellow-100',
    'beverages': 'bg-purple-50',
    'bakery': 'bg-orange-100',
    'snacks': 'bg-yellow-50',
    'frozen': 'bg-blue-100',
    'canned': 'bg-gray-50',
    'condiments': 'bg-amber-100',
  }

  const key = categoryName.toLowerCase()
  return colorMap[key] || 'bg-gray-50'
}
