import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// Helper function to upload image
async function uploadImage(request: Request, imageFile: File) {
  const uploadFormData = new FormData();
  uploadFormData.append('image', imageFile);

  const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload-image`, {
    method: 'POST',
    body: uploadFormData,
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json();
    throw new Error(errorData.message || 'Image upload failed');
  }

  const uploadResult = await uploadResponse.json();
  return uploadResult.imageUrl;
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user || user.role !== 'SELLER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const prefecture = formData.get('prefecture') as string;
    const city = formData.get('city') as string;
    const logoFile = formData.get('logo') as File | null;
    const bannerFile = formData.get('banner') as File | null;

    if (!name || !prefecture || !city) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let logoUrl: string | null = null;
    if (logoFile) {
      logoUrl = await uploadImage(request, logoFile);
    }

    let bannerUrl: string | null = null;
    if (bannerFile) {
      bannerUrl = await uploadImage(request, bannerFile);
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        prefecture,
        city,
        ownerId: user.id,
        logoUrl,
        bannerUrl,
      },
    });

    return NextResponse.json({ message: 'Store created successfully', store }, { status: 201 });
  } catch (error) {
    console.error('Store creation error:', error);
    return NextResponse.json({ message: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user || user.role !== 'SELLER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('id');

    if (!storeId) {
      return NextResponse.json({ message: 'Store ID is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const prefecture = formData.get('prefecture') as string;
    const city = formData.get('city') as string;
    const logoFile = formData.get('logo') as File | null;
    const bannerFile = formData.get('banner') as File | null;

    // Find the store to ensure the user is the owner
    const existingStore = await prisma.store.findUnique({
      where: { id: parseInt(storeId) },
    });

    if (!existingStore || existingStore.ownerId !== user.id) {
      return NextResponse.json({ message: 'Store not found or unauthorized' }, { status: 404 });
    }

    let logoUrl: string | null | undefined = existingStore.logoUrl;
    if (logoFile) {
      logoUrl = await uploadImage(request, logoFile);
    }

    let bannerUrl: string | null | undefined = existingStore.bannerUrl;
    if (bannerFile) {
      bannerUrl = await uploadImage(request, bannerFile);
    }

    const updatedStore = await prisma.store.update({
      where: { id: parseInt(storeId) },
      data: {
        name: name || existingStore.name,
        description: description || existingStore.description,
        prefecture: prefecture || existingStore.prefecture,
        city: city || existingStore.city,
        logoUrl,
        bannerUrl,
      },
    });

    return NextResponse.json({ message: 'Store updated successfully', store: updatedStore }, { status: 200 });
  } catch (error) {
    console.error('Store update error:', error);
    return NextResponse.json({ message: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
