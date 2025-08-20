import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        owner: {
          select: {
            name: true,
          }
        }
      }
    });
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}