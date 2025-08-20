import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch a limited number of rental products, e.g., 4 featured rentals
    const rentals = await prisma.rentalProduct.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc', // Or based on a 'featured' flag, or popularity
      },
    });
    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Error fetching featured rentals:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
