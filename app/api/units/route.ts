import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";
import { prisma } from '@/lib/prisma';

// Schema for creating a unit
const unitSchema = z.object({
  unitName_en: z.string().min(1, { message: "English Unit Name is required." }),
  abbreviation_en: z.string().min(1, { message: "English Abbreviation is required." }),
  unitName_ta: z.string().min(1, { message: "Tamil Unit Name is required." }),
  abbreviation_ta: z.string().min(1, { message: "Tamil Abbreviation is required." }),
  isDeleted: z.boolean().default(false).optional(),
  isPublish: z.boolean().default(true).optional(),
});

// Schema for updating a unit (all fields optional except id)
const updateUnitSchema = unitSchema.partial().extend({
  id: z.number().int(),
});

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = unitSchema.parse(body);

    const unit = await prisma.unit.create({
      data: {
        unitName_en: validatedData.unitName_en,
        abbreviation_en: validatedData.abbreviation_en,
        unitName_ta: validatedData.unitName_ta,
        abbreviation_ta: validatedData.abbreviation_ta,
        isDeleted: validatedData.isDeleted,
        isPublish: validatedData.isPublish,
      },
    });

    return NextResponse.json(unit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error creating unit:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateUnitSchema.parse(body);

    const { id, ...updateData } = validatedData;

    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error updating unit:", error);
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
      return new NextResponse("Unit ID is required", { status: 400 });
    }

    await prisma.unit.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting unit:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
