import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const [stores, totalStores] = await prisma.$transaction([
      prisma.store.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true, email: true } } },
      }),
      prisma.store.count(),
    ]);

    return NextResponse.json({
      data: stores,
      pagination: {
        totalStores,
        totalPages: Math.ceil(totalStores / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stores for admin:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
