import { prisma } from '@/lib/data/prisma'

export async function checkUserStore(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        stores: {
          where: { isBlocked: false },
          orderBy: { createdAt: 'desc' }
        },
        currentStore: true
      }
    })

    if (!user) {
      return { hasStore: false, stores: [], currentStore: null }
    }

    const hasStore = user.stores.length > 0
    const currentStore = user.currentStore || user.stores[0] || null

    // If user has stores but no current store set, set the first one as current
    if (hasStore && !user.currentStore && user.stores[0]) {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { currentStoreId: user.stores[0].id }
      })
    }

    return {
      hasStore,
      stores: user.stores,
      currentStore: currentStore || user.stores[0],
      storeId: currentStore?.id || user.stores[0]?.id || null, // Add storeId for backward compatibility
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    }
  } catch (error) {
    console.error('Error checking user store:', error)
    return { hasStore: false, stores: [], currentStore: null, storeId: null }
  }
}
