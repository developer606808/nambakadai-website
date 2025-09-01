import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateVehicleAdId } from '@/lib/utils/ad-id'

// Vehicle validation schema
const vehicleSchema = z.object({
  name: z.string()
    .min(2, 'Vehicle name must be at least 2 characters')
    .max(100, 'Vehicle name must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  type: z.enum(['TRACTOR', 'TRUCK', 'LORRY', 'VAN', 'HARVESTING_MACHINE', 'PLANTING_MACHINE', 'THRESHING_MACHINE', 'CULTIVATOR', 'PLOUGH', 'SPRAYER', 'TRAILER', 'OTHER_EQUIPMENT']),
  
  category: z.string()
    .min(1, 'Category is required'),
  
  pricePerDay: z.number()
    .min(1, 'Daily price must be greater than 0')
    .max(50000, 'Daily price must be less than ₹50,000'),
  
  pricePerHour: z.number()
    .min(1, 'Hourly price must be greater than 0')
    .max(5000, 'Hourly price must be less than ₹5,000'),
  
  capacity: z.string()
    .min(1, 'Capacity is required'),
  
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID']),
  
  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),
  
  features: z.array(z.string())
    .min(1, 'At least one feature is required'),
  
  images: z.array(z.string())
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed')
})

// GET - Fetch vehicles for seller
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Convert user ID to integer
    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''

    // Build where clause
    const where: any = {
      userId: userId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    // Fetch vehicles with pagination
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          bookings: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true
            }
          }
        }
      }),
      prisma.vehicle.count({ where })
    ])

    return NextResponse.json({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Vehicles GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST - Create new vehicle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a seller
    if (session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can create vehicle listings' },
        { status: 403 }
      )
    }

    // Convert user ID to integer
    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    let validatedData
    try {
      validatedData = vehicleSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        validationError.errors.forEach((error) => {
          if (error.path.length > 0) {
            errors[error.path[0]] = error.message
          }
        })
        
        return NextResponse.json(
          { 
            error: 'Validation failed',
            errors 
          },
          { status: 400 }
        )
      }
      throw validationError
    }

    // Get store name for adId generation (assuming user has a store)
    const userWithStore = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        currentStore: {
          select: { name: true }
        }
      }
    });

    if (!userWithStore?.currentStore) {
      return NextResponse.json(
        { error: 'User is not associated with a store' },
        { status: 400 }
      );
    }

    // Generate adId
    const adId = generateVehicleAdId(userWithStore.currentStore.name);

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        ...validatedData,
        userId: userId,
        status: 'AVAILABLE',
        rating: 0,
        totalBookings: 0,
        adId: adId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      vehicle,
      message: 'Vehicle created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
