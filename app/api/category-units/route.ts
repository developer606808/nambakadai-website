import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";
import prisma from '@/lib/prisma';

// Schema for creating a CategoryUnit association
const createCategoryUnitSchema = z.object({
  category_id: z.number().int({ message: "Category ID is required and must be an integer." }),
  unit_id: z.number().int({ message: "Unit ID is required and must be an integer." }),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCategoryUnitSchema.parse(body);

    const categoryUnit = await prisma.categoryUnit.create({
      data: {
        category_id: validatedData.category_id,
        unit_id: validatedData.unit_id,
      },
    });

    return NextResponse.json(categoryUnit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error creating CategoryUnit association:", error);
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
    const category_id = searchParams.get('category_id');
    const unit_id = searchParams.get('unit_id');

    if (!category_id || !unit_id) {
      return new NextResponse("Category ID and Unit ID are required", { status: 400 });
    }

    await prisma.categoryUnit.delete({
      where: {
        category_id_unit_id: {
          category_id: parseInt(category_id),
          unit_id: parseInt(unit_id),
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting CategoryUnit association:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
