import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/products - Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const storeId = searchParams.get('storeId') || '';
    const status = searchParams.get('status') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { store: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name_en: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = parseInt(categoryId);
    }

    if (storeId && storeId !== 'all') {
      where.storeId = parseInt(storeId);
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        where.stock = { gt: 0 };
      } else if (status === 'inactive') {
        where.stock = 0;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name_en: true,
              name_ta: true,
              slug: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              name_en: true,
              symbol: true,
            },
          },
          state: {
            select: {
              id: true,
              name_en: true,
            },
          },
          city: {
            select: {
              id: true,
              name_en: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform data for frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      slug: product.slug,
      adId: product.adId,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: {
        id: product.category.id,
        name: product.category.name_en,
        slug: product.category.slug,
      },
      store: {
        id: product.store.id,
        name: product.store.name,
      },
      unit: {
        id: product.unit.id,
        name: product.unit.name_en,
        symbol: product.unit.symbol,
      },
      location: {
        state: product.state.name_en,
        city: product.city.name_en,
      },
      seller: {
        id: product.user.id,
        name: product.user.name,
        email: product.user.email,
      },
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}