
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// This API route is for sellers to manage their own products.
export async function GET(request: Request) {
  // 1. Authenticate the user and ensure they are a SELLER
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Find the store associated with the logged-in seller
    const store = await prisma.store.findUnique({
      where: { ownerId: user.id },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ error: 'No store found for this seller.' }, { status: 404 });
    }

    // 3. Fetch only the products that belong to the seller's store
    const products = await prisma.product.findMany({
      where: {
        storeId: store.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error('Failed to fetch seller products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// You can also add a POST function here for creating products,
// ensuring the new product is linked to the seller's storeId.
