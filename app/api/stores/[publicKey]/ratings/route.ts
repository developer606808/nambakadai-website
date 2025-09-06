import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

// GET /api/stores/[publicKey]/ratings - Get all ratings for a store
export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    const { publicKey } = await params;
    console.log('Fetching ratings for store:', publicKey);

    // Find store by publicKey
    const store = await prisma.store.findFirst({
      where: { publicKey },
      select: { id: true }
    });

    if (!store) {
      console.log('Store not found for publicKey:', publicKey);
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    console.log('Found store with ID:', store.id);

    // Get all ratings for this store
    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('Found ratings:', ratings.length);

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings
      : 0;

    const response = {
      ratings,
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10
    };

    console.log('Returning response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching store ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST /api/stores/[publicKey]/ratings - Create or update a rating
export async function POST(
  request: Request,
  { params }: { params: Promise<{ publicKey: string }> }
) {
  try {
    console.log('POST request to ratings API');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.id) {
      console.log('No authentication found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { publicKey } = await params;
    const { value, comment } = await request.json();
    console.log('Request data:', { publicKey, value, comment });

    // Validate rating value
    if (value < 1 || value > 5) {
      console.log('Invalid rating value:', value);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find store by publicKey
    const store = await prisma.store.findFirst({
      where: { publicKey },
      select: { id: true, userId: true }
    });

    if (!store) {
      console.log('Store not found for publicKey:', publicKey);
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    console.log('Found store:', store.id);

    // Check if user already rated this store
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: parseInt(session.user.id),
        storeId: store.id
      }
    });

    console.log('Existing rating:', existingRating);

    let rating;
    if (existingRating) {
      // Update existing rating
      console.log('Updating existing rating');
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          value,
          comment: comment?.trim() || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
    } else {
      // Create new rating
      console.log('Creating new rating');
      rating = await prisma.rating.create({
        data: {
          value,
          comment: comment?.trim() || null,
          userId: parseInt(session.user.id),
          storeId: store.id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });
    }

    console.log('Rating saved successfully:', rating);
    return NextResponse.json(rating);
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}