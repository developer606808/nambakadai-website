import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch a limited number of popular stores, e.g., 4 stores
    // Popularity could be based on number of products, reviews, sales, etc.
    const stores = await prisma.store.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc', // Placeholder for popularity logic
      },
    });
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching popular stores:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
