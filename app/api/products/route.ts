import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { productSchema } from '@/lib/validations/schemas';
import { z } from 'zod';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { generateProductAdId } from '@/lib/utils/ad-id';

// GET /api/products - Get all products with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
<<<<<<< Updated upstream
    const stateId = searchParams.get('state');
    const cityId = searchParams.get('city');
=======
    const stateId = searchParams.get('stateId');
    const cityId = searchParams.get('cityId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sellerOnly = searchParams.get('sellerOnly') === 'true';
>>>>>>> Stashed changes

    const where: any = {
      // Only show approved products
    };

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

<<<<<<< Updated upstream
=======
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first

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

>>>>>>> Stashed changes
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        category: true,
        store: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
<<<<<<< Updated upstream
        state: true,
        city: true,
        unit: true
=======
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
>>>>>>> Stashed changes
      }
    });

    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transform products for frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
      category: {
        id: product.category.id,
        name: product.category.name_en,
        slug: product.category.slug
      },
      store: {
        id: product.store.id,
        name: product.store.name,
        logo: product.store.logo
      },
      location: `${product.city?.name_en || ''}, ${product.state?.name_en || ''}`,
      unit: {
        symbol: product.unit.symbol,
        name: product.unit.name_en
      },
      stock: product.stock,
      isFeatured: product.isFeatured,
      wishlistCount: product._count.wishlist,
      createdAt: product.createdAt,
      slug: product.slug,
      publicKey: product.publicKey
    }));

    return NextResponse.json({
<<<<<<< Updated upstream
      products,
=======
      products: transformedProducts,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    // Create product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        storeId: session.user.storeId // Assuming storeId is added to session
      },
      include: {
        category: true,
        store: true,
        state: true,
        city: true,
        unit: true
=======
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
>>>>>>> Stashed changes
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