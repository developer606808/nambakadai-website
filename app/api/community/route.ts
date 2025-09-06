import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/community - Check if user has created a community
export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Check if user has created any community (where they are ADMIN)
    const userCommunity = await prisma.communityMember.findFirst({
      where: {
        userId,
        role: 'ADMIN'
      },
      include: {
        community: true
      }
    });

    // If user has a community, fetch complete community data with counts
    let completeCommunity = null;
    if (userCommunity) {
      const communityData = await prisma.community.findUnique({
        where: { id: userCommunity.community.id },
        include: {
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
      });

      if (communityData) {
        completeCommunity = {
          id: communityData.id,
          uuid: (communityData as any).uuid,
          name: communityData.name,
          description: communityData.description,
          image: communityData.image,
          category: communityData.category,
          location: communityData.location,
          memberCount: (communityData as any)._count.members,
          postCount: (communityData as any)._count.posts,
          isVerified: communityData.isVerified,
          createdAt: communityData.createdAt
        };
      }
    }

    return NextResponse.json({
      hasCreatedCommunity: !!userCommunity,
      community: completeCommunity
    });
  } catch (error) {
    console.error('Error checking user community status:', error);
    return NextResponse.json(
      { error: 'Failed to check community status' },
      { status: 500 }
    );
  }
}

// POST /api/community - Create a new community
export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    console.log('Session user ID:', session.user.id);
    console.log('Parsed user ID:', userId);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('User found:', !!user);
    if (user) {
      console.log('User details:', { id: user.id, email: user.email, name: user.name, role: user.role });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is admin - admins cannot create communities
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Admins are not allowed to create communities' },
        { status: 403 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const category = formData.get('category')?.toString() || '';
    const privacy = formData.get('privacy')?.toString() || 'PUBLIC';
    const location = formData.get('location')?.toString() || null;
    const rules = formData.get('rules')?.toString() || null;
    const imageFile = formData.get('image') as File | null;
    const bannerFile = formData.get('banner') as File | null;

    // Validate required fields
    if (!name.trim() || !description.trim() || !category.trim()) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    // Handle image uploads if provided
    let imageUrl = null;
    let bannerUrl = null;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'community');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    if (imageFile) {
      // Save image to public/uploads/community
      const imageFileName = `community-image-${Date.now()}-${Math.random().toString(36).substring(7)}.${imageFile.name.split('.').pop()}`;
      const imagePath = path.join(uploadDir, imageFileName);

      // Convert File to Buffer and save
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(imagePath, imageBuffer);

      imageUrl = `/uploads/community/${imageFileName}`;
    }

    if (bannerFile) {
      // Save banner to public/uploads/community
      const bannerFileName = `community-banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${bannerFile.name.split('.').pop()}`;
      const bannerPath = path.join(uploadDir, bannerFileName);

      // Convert File to Buffer and save
      const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
      await fs.writeFile(bannerPath, bannerBuffer);

      bannerUrl = `/uploads/community/${bannerFileName}`;
    }

    // Create community
    const community = await prisma.community.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        image: imageUrl,
        banner: bannerUrl,
        category: category.trim(),
        privacy: (privacy?.toUpperCase() === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC') as any,
        location: location?.trim() || null,
        rules: rules?.trim() || null,
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
      } as any,
    });

    return NextResponse.json({
      ...community,
      uuid: (community as any).uuid
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    );
  }
}