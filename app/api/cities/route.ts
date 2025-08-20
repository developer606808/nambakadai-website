import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get('stateId');

  if (!stateId) {
    return NextResponse.json({ message: 'stateId is required' }, { status: 400 });
  }

  try {
    const cities = await prisma.city.findMany({
      where: {
        state_id: parseInt(stateId, 10),
      },
    });
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}