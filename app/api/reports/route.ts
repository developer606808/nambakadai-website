import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { reportSchema } from '@/lib/validations/schemas';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for reports
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'report' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = reportSchema.parse(body);

    // Convert user ID to integer
    const reporterId = parseInt(session.user.id);
    if (isNaN(reporterId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        reason: validatedData.reason,
        description: validatedData.description,
        ...(validatedData.productId && { productId: parseInt(validatedData.productId) }),
        ...(validatedData.userId && { userId: parseInt(validatedData.userId) }),
        reporterId: reporterId
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

// GET /api/reports - Get reports (admin only)
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const resolved = searchParams.get('resolved');

    const where: Prisma.ReportWhereInput = {};
    
    if (resolved === 'true') {
      where.resolved = true;
    } else if (resolved === 'false') {
      where.resolved = false;
    }

    const reports = await prisma.report.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const total = await prisma.report.count({ where });

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}