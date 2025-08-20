
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define the schema for query parameters for validation.
const categoryQuerySchema = z.object({
  sortBy: z.enum(['name_en', 'sort_order']).default('sort_order'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validation = categoryQuerySchema.safeParse(query);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: validation.error.flatten() }, { status: 400 });
    }

    const { sortBy, order } = validation.data;

    // Fetch categories from the database using Prisma
    const categories = await prisma.category.findMany({
      where: {
        is_active: true, // Only fetch active categories
      },
      orderBy: {
        [sortBy]: order,
      },
      select: {
        id: true,
        name_en: true,
        slug: true,
        icon: true,
        image_url: true,
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
