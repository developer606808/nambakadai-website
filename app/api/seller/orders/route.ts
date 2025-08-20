
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// GET: Fetch orders for the current seller's store
export async function GET(request: Request) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await prisma.store.findUnique({ where: { ownerId: user.id } });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Find orders that contain products from the seller's store
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              storeId: store.id,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            product: {
              storeId: store.id, // Only include items from this seller's store
            },
          },
          include: {
            product: { select: { name: true, images: true } },
          },
        },
        user: { select: { name: true, email: true } }, // Include customer info
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch seller orders:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
