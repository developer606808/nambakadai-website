import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET - Fetch vehicle bookings for seller
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
    const status = searchParams.get('status') || ''

    // Build where clause for seller's vehicles
    const where: Prisma.VehicleBookingWhereInput = {
      vehicle: {
        userId: userId
      }
    }

    if (status) {
      where.status = status as any
    }

    // Fetch bookings with pagination
    const [bookings, total] = await Promise.all([
      prisma.vehicleBooking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              pricePerHour: true,
              pricePerDay: true,
              images: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.vehicleBooking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Bookings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Update booking status (for sellers)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const { bookingId, status, notes } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      )
    }

    // Verify the booking belongs to seller's vehicle
    const booking = await prisma.vehicleBooking.findFirst({
      where: {
        id: parseInt(bookingId),
        vehicle: {
          userId: userId
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Update booking status
    const updatedBooking = await prisma.vehicleBooking.update({
      where: { id: parseInt(bookingId) },
      data: {
        status,
        ...(notes && { notes })
      },
      include: {
        vehicle: true,
        customer: true
      }
    })

    // Update vehicle status based on booking status
    if (status === 'ONGOING') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'RENTED' }
      })
    } else if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'AVAILABLE' }
      })
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking status updated successfully'
    })

  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// PUT - Create new booking (for customers)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customerId = parseInt(session.user.id)
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const {
      vehicleId,
      startDate,
      endDate,
      totalHours,
      totalDays,
      customerName,
      customerPhone,
      customerEmail,
      purpose,
      notes
    } = await request.json()

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Vehicle ID, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Get vehicle details
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    if (vehicle.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Vehicle is not available for booking' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    if (totalDays && vehicle.pricePerDay) {
      totalAmount = totalDays * vehicle.pricePerDay
    } else if (totalHours) {
      totalAmount = totalHours * vehicle.pricePerHour
    }

    // Create booking
    const booking = await prisma.vehicleBooking.create({
      data: {
        vehicleId: parseInt(vehicleId),
        customerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalHours,
        totalDays,
        totalAmount,
        customerName: customerName || session.user.name || '',
        customerPhone: customerPhone || '',
        customerEmail: customerEmail || session.user.email || '',
        purpose,
        notes,
        status: 'PENDING'
      },
      include: {
        vehicle: true,
        customer: true
      }
    })

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
