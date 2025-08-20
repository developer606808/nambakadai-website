
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// GET stats for the current seller's dashboard
export async function GET(request: Request) {
  const user = await getUserFromCookie();
  if (!user || user.role !== 'SELLER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const store = await prisma.store.findUnique({ where: { ownerId: user.id } });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const [productCount, totalRevenue, orderCount] = await prisma.$transaction([
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'COMPLETED', items: { some: { product: { storeId: store.id } } } },
    }),
    prisma.order.count({ where: { items: { some: { product: { storeId: store.id } } } } }),
  ]);

  return NextResponse.json({
    productCount,
    revenue: totalRevenue._sum.total || 0,
    orderCount,
  });
}
