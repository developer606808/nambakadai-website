import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Correct import path
import { prisma } from '@/lib/prisma'; // Correct import style

async function generateSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")           // replace spaces with -
    .replace(/-+/g, "-");           // collapse multiple -
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      description,
      contactName,
      contactPhone,
      contactEmail,
      address,
      stateId,
      cityId,
      pincode,
      logoUrl,
      bannerUrl,
    } = await req.json();

    // Basic validation for required fields
    if (!name || !description || !contactName || !contactPhone || !address || !stateId || !cityId || !pincode) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate contactPhone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactPhone)) {
      return NextResponse.json({ message: 'Invalid contact phone number' }, { status: 400 });
    }

    // Validate contactEmail (optional, but if provided, must be valid)
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return NextResponse.json({ message: 'Invalid pincode' }, { status: 400 });
    }

    const slug = await generateSlug(name);

    // Check if slug already exists
    const existingStore = await prisma.store.findUnique({
      where: { slug },
    });

    if (existingStore) {
      return NextResponse.json({ message: 'Store with this slug already exists' }, { status: 409 });
    }

    // Check if user already has a store
    const userHasStore = await prisma.store.findUnique({
      where: { ownerId: Number(session.user.id) },
    });

    if (userHasStore) {
      return NextResponse.json({ message: 'You already own a store' }, { status: 409 });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        slug,
        description,
        contactName,
        contactPhone,
        contactEmail,
        address,
        // stateId: parseInt(stateId), // Ensure stateId is an integer
        // cityId: parseInt(cityId),   // Ensure cityId is an integer
        pincode,
        logoUrl,
        bannerUrl,
        owner: {
          connect: { id: Number(session.user.id) },
        },
        state: stateId ? { connect: { id: Number(stateId) } } : undefined,
        city: cityId ? { connect: { id: Number(cityId) } } : undefined,
      },
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}