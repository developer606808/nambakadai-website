import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { productSchema } from '@/lib/validations/schemas';
import { z } from 'zod';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { generateProductAdId } from '@/lib/utils/ad-id';
import { Prisma } from '@prisma/client';

// GET /api/products - Get all products with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Get session for seller-specific products
    const session = await getServerSession(authOptions);
    console.log('Session retrieved:', session ? 'YES' : 'NO');
    if (session) {
      console.log('Session user:', session.user);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const stateId = searchParams.get('stateId');
    const cityId = searchParams.get('cityId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sellerOnly = searchParams.get('sellerOnly') === 'true';

    const where: Prisma.ProductWhereInput = {
      // Only show approved products
    };

    // Filter for seller's own products if sellerOnly is true
    if (sellerOnly && session) {
      console.log('SellerOnly filtering enabled, session user:', session.user);
      const userId = parseInt(session.user.id);
      console.log('Parsed userId:', userId, 'isNaN:', isNaN(userId));
      if (!isNaN(userId)) {
        where.userId = userId;
        console.log('Applied userId filter:', userId);
      } else {
        console.log('Failed to parse userId, no filter applied');
      }
    } else {
      console.log('SellerOnly filtering not applied:', { sellerOnly, hasSession: !!session });
    }

    // Apply filters
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (stateId) {
      where.stateId = parseInt(stateId);
    }

    if (cityId) {
      where.cityId = parseInt(cityId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }; // Default: newest first

    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { title: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name_en: true,
            name_ta: true,
            slug: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
        city: {
          select: {
            name_en: true
          }
        },
        state: {
          select: {
            name_en: true
          }
        },
        unit: {
          select: {
            id: true,
            name_en: true,
            symbol: true
          }
        },
        _count: {
          select: {
            wishlist: true
          }
        }
      }
    });

    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transform products for frontend
    const transformedProducts = products.map(product => {
      console.log(`Product ${product.id} (${product.title}): categoryId=${product.categoryId}, category=${product.category?.name_en || 'null'}`);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category ? {
          id: product.category.id,
          name_en: product.category.name_en,
          name_ta: product.category.name_ta,
          slug: product.category.slug
        } : null,
        store: product.store ? {
          id: product.store.id,
          name: product.store.name,
          logo: product.store.logo
        } : null,
        location: `${product.city?.name_en || ''}, ${product.state?.name_en || ''}`.trim(),
        unit: product.unit ? {
          id: product.unit.id,
          symbol: product.unit.symbol,
          name_en: product.unit.name_en
        } : null,
        stock: product.stock,
        isFeatured: product.isFeatured,
        wishlistCount: product._count.wishlist,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        slug: product.slug,
        publicKey: product.publicKey
      };
    });

    console.log(`Total products returned: ${transformedProducts.length}`);

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        applied: {
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          stateId: stateId ? parseInt(stateId) : undefined,
          cityId: cityId ? parseInt(cityId) : undefined,
          search,
          sortBy
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate user is a seller
    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Ensure user has an associated store
    if (!session.user.hasStore || !session.user.currentStore) {
      return NextResponse.json(
        { error: 'User is not associated with a store' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Extract title, falling back to name if title is not provided
    const productTitle = body.title || body.name;

    // Generate slug if not provided
    let slug = body.slug;
    if (!slug) {
      slug = await generateUniqueSlug(productTitle, session.user.currentStore.id);
    }

    // Remove original name field from body if present, to avoid schema conflicts
    const { name, ...restOfBody } = body;

    const dataToValidate = {
      ...restOfBody,
      title: productTitle,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      unitId: body.unitId ? Number(body.unitId) : undefined,
    };

    const validatedData = productSchema.parse(dataToValidate);

    // Convert user ID to integer
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get store name for adId generation
    const store = await prisma.store.findUnique({
      where: { id: session.user.currentStore.id },
      select: { name: true }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Generate adId
    const adId = generateProductAdId(store.name);

    // Create product
    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        slug: slug, // Use the generated slug
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        images: validatedData.images,
        userId: userId,
        storeId: session.user.currentStore.id,
        categoryId: validatedData.categoryId,
        unitId: validatedData.unitId,
        stateId: 1, // Default to Tamil Nadu for now
        cityId: 1,  // Default to Chennai for now
        adId: adId
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    // Log the full error object for detailed debugging
    // console.error('Full error details:', JSON.stringify(error, null, 2)); // Temporarily commented out
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}