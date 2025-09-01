import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/stores/[publicKey] - Get store details by publicKey
export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    const { publicKey } = await params;

    // Fetch store details using publicKey
    const store = await (prisma as any).store.findFirst({
      where: { publicKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        },
        products: {
          include: {
            category: {
              select: {
                name_en: true,
                name_ta: true,
              }
            },
            unit: {
              select: {
                symbol: true,
              }
            }
          },
          take: 12, // Limit to 12 products for initial load
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: true,
            ratings: true
          }
        }
      }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}