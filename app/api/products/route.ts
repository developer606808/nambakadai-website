import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for validating query parameters for products
const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  categorySlug: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = productQuerySchema.safeParse(query);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: validation.error.flatten() }, { status: 400 });
    }

    const { page, limit, categorySlug, sortBy, order } = validation.data;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    // Fetch products and total count in parallel
    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          category: {
            select: {
              name_en: true,
              slug: true,
            }
          }
        }
      }),
      prisma.product.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}