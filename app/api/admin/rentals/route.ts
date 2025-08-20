import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";
import { prisma } from '@/lib/prisma';

// Helper function to upload image (reused from previous implementations)
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

// Schema for creating a rental product
const rentalProductSchema = z.object({
  name: z.string().min(1, { message: "Rental Product Name is required." }),
  description: z.string().optional(),
  rentalRate: z.number().min(0, { message: "Rental Rate must be a non-negative number." }),
  rentalUnit: z.string().min(1, { message: "Rental Unit is required." }),
  availabilityStart: z.string().datetime().optional().nullable(), // ISO string
  availabilityEnd: z.string().datetime().optional().nullable(),   // ISO string
  depositAmount: z.number().min(0).optional().nullable(),
  categoryId: z.number().int({ message: "Category ID is required and must be an integer." }),
  storeId: z.number().int({ message: "Store ID is required and must be an integer." }),
  // images: z.array(z.string()).optional(), // Handled separately for file uploads
});

// Schema for updating a rental product (all fields optional except id)
const updateRentalProductSchema = rentalProductSchema.partial().extend({
  id: z.number().int(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [rentalProducts, totalRentals] = await prisma.$transaction([
      prisma.rentalProduct.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true, store: true },
      }),
      prisma.rentalProduct.count(),
    ]);

    return NextResponse.json({
      data: rentalProducts,
      pagination: {
        totalRentals,
        totalPages: Math.ceil(totalRentals / limit),
        currentPage: page,
      },
    });

  } catch (error) {
    console.error('Error fetching rental products (admin):', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const rentalRate = parseFloat(formData.get('rentalRate') as string);
    const rentalUnit = formData.get('rentalUnit') as string;
    const availabilityStart = formData.get('availabilityStart') as string | null;
    const availabilityEnd = formData.get('availabilityEnd') as string | null;
    const depositAmount = formData.get('depositAmount') ? parseFloat(formData.get('depositAmount') as string) : null;
    const categoryId = parseInt(formData.get('categoryId') as string);
    const storeId = parseInt(formData.get('storeId') as string);
    const imageFiles = formData.getAll('images') as File[];

    const validatedData = rentalProductSchema.parse({
      name, description, rentalRate, rentalUnit, 
      availabilityStart: availabilityStart || undefined, 
      availabilityEnd: availabilityEnd || undefined, 
      depositAmount: depositAmount || undefined,
      categoryId, storeId
    });

    let imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size > 0) { // Ensure file is not empty
          const imageUrl = await uploadImage(request, file);
          imageUrls.push(imageUrl);
        }
      }
    }

    const rentalProduct = await prisma.rentalProduct.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        rentalRate: validatedData.rentalRate,
        rentalUnit: validatedData.rentalUnit,
        availabilityStart: validatedData.availabilityStart ? new Date(validatedData.availabilityStart) : null,
        availabilityEnd: validatedData.availabilityEnd ? new Date(validatedData.availabilityEnd) : null,
        depositAmount: validatedData.depositAmount,
        categoryId: validatedData.categoryId,
        storeId: validatedData.storeId,
        images: imageUrls,
      },
    });

    return NextResponse.json(rentalProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error creating rental product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const rentalRate = parseFloat(formData.get('rentalRate') as string);
    const rentalUnit = formData.get('rentalUnit') as string;
    const availabilityStart = formData.get('availabilityStart') as string | null;
    const availabilityEnd = formData.get('availabilityEnd') as string | null;
    const depositAmount = formData.get('depositAmount') ? parseFloat(formData.get('depositAmount') as string) : null;
    const categoryId = parseInt(formData.get('categoryId') as string);
    const storeId = parseInt(formData.get('storeId') as string);
    const existingImageUrls = JSON.parse(formData.get('existingImageUrls') as string || '[]'); // Existing images not re-uploaded
    const newImageFiles = formData.getAll('newImages') as File[]; // New images to upload

    const validatedData = updateRentalProductSchema.parse({
      id, name, description, rentalRate, rentalUnit,
      availabilityStart: availabilityStart || undefined,
      availabilityEnd: availabilityEnd || undefined,
      depositAmount: depositAmount || undefined,
      categoryId, storeId
    });

    let imageUrls: string[] = [...existingImageUrls];
    if (newImageFiles && newImageFiles.length > 0) {
      for (const file of newImageFiles) {
        if (file.size > 0) { // Ensure file is not empty
          const imageUrl = await uploadImage(request, file);
          imageUrls.push(imageUrl);
        }
      }
    }

    const rentalProduct = await prisma.rentalProduct.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        rentalRate: validatedData.rentalRate,
        rentalUnit: validatedData.rentalUnit,
        availabilityStart: validatedData.availabilityStart ? new Date(validatedData.availabilityStart) : null,
        availabilityEnd: validatedData.availabilityEnd ? new Date(validatedData.availabilityEnd) : null,
        depositAmount: validatedData.depositAmount,
        categoryId: validatedData.categoryId,
        storeId: validatedData.storeId,
        images: imageUrls,
      },
    });

    return NextResponse.json(rentalProduct, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error updating rental product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Rental Product ID is required", { status: 400 });
    }

    await prisma.rentalProduct.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting rental product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
