import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().min(3),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

// GET all banners with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const isActive = searchParams.get('isActive');

  const where = isActive ? { isActive: isActive === 'true' } : {};

  try {
    const [banners, totalBanners] = await prisma.$transaction([
      prisma.banner.findMany({
        skip,
        take: limit,
        where,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.banner.count({ where }),
    ]);

    const totalPages = Math.ceil(totalBanners / limit);

    return NextResponse.json({
      data: banners,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalBanners,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST a new banner
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const validation = bannerSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const newBanner = await prisma.banner.create({ data: validation.data });
  return NextResponse.json(newBanner, { status: 201 });
}