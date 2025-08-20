import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const unitUpdateSchema = z.object({
  unitName_en: z.string().min(1).optional(),
  abbreviation_en: z.string().min(1).optional(),
  unitName_ta: z.string().optional(),
  abbreviation_ta: z.string().optional(),
  categoryIds: z.array(z.number().int()).min(1, "At least one category is required").optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const validation = unitUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const { categoryIds, ...unitData } = validation.data;

    const updatedUnit = await prisma.$transaction(async (tx) => {
      // First, update the unit's own fields
      const unit = await tx.unit.update({
        where: { id },
        data: unitData,
      });

      // If categoryIds are provided, update the associations
      if (categoryIds) {
        // Delete existing associations
        await tx.categoryUnit.deleteMany({ where: { unit_id: id } });
        // Create new associations
        await tx.categoryUnit.createMany({
          data: categoryIds.map(catId => ({ unit_id: id, category_id: catId }))
        });
      }
      return unit;
    });

    return NextResponse.json(updatedUnit);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const id = parseInt(params.id, 10);
        // The schema's onDelete: Cascade should handle related CategoryUnit entries
        await prisma.unit.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
