import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid store ID' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        products: {
          take: 10, // Include the 10 most recent products
          orderBy: { createdAt: 'desc' },
        },
        owner: {
          select: { name: true, image: true, createdAt: true }
        }
      }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error(`Failed to fetch store ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}