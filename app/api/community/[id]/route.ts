import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/community/[id] - Get a specific community
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');

    const community = await prisma.community.findUnique({
      where: isUUID ? { uuid: id } as any : { id: parseInt(id) },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...community,
      memberCount: (community as any)._count.members,
      postCount: (community as any)._count.posts,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

// PUT /api/community/[id] - Update a community
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');
    const whereClause = isUUID ? { uuid: id } as any : { id: parseInt(id) };

    // Handle image uploads if provided
    let imageUrl = undefined;
    let bannerUrl = undefined;

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

    // In a real app, you would validate that the user has permission to update this community
    // For now, we'll just update it

    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      privacy: (privacy?.toUpperCase() === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC') as any,
      location: location?.trim() || null,
      rules: rules?.trim() || null,
    };

    // Only include image/banner if they were provided
    if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }
    if (bannerUrl !== undefined) {
      updateData.banner = bannerUrl;
    }

    const community = await prisma.community.update({
      where: whereClause,
      data: updateData,
    });

    return NextResponse.json(community);
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: 'Failed to update community' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/[id] - Delete a community
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's a UUID (contains hyphens) or integer ID
    const isUUID = id.includes('-');
    const whereClause = isUUID ? { uuid: id } as any : { id: parseInt(id) };

    // In a real app, you would validate that the user has permission to delete this community
    // For now, we'll just delete it

    await prisma.community.delete({
      where: whereClause,
    });

    return NextResponse.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: 'Failed to delete community' },
      { status: 500 }
    );
  }
}