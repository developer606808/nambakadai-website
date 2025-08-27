import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/community - Create a new community
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId; // In a real app, get from session

    // Create community
    const community = await prisma.community.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image || null,
        category: body.category,
        privacy: body.privacy || 'PUBLIC',
        location: body.location || null,
        rules: body.rules || null,
        memberCount: 1, // Creator is automatically a member
        postCount: 0,
        isVerified: false,
        isBlocked: false,
        members: {
          create: {
            userId,
            role: 'ADMIN',
            isApproved: true,
            joinedAt: new Date(),
          },
        },
      },
    });

    return NextResponse.json(community, { status: 201 });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    );
  }
}