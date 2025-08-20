import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch a limited number of products, e.g., 8 featured products
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc', // Or based on a 'featured' flag, or popularity
      },
      // Include related data if necessary, e.g., seller info
      // include: { seller: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
