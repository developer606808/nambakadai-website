import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/data/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    console.log('Profile API called')
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    console.log('Session user:', session?.user)
    console.log('Session user ID:', session?.user?.id)
    console.log('Session user ID type:', typeof session?.user?.id)

    if (!session?.user?.id) {
      console.log('No session or user ID found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Session user ID:', session.user.id)
    const userId = parseInt(session.user.id)
    console.log('Parsed user ID:', userId)

    if (isNaN(userId)) {
      console.log('Invalid user ID format')
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }
    console.log('Querying user with ID:', userId)

    // First, let's check if we can connect to the database
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            stores: true,
            wishlist: true,
          }
        }
      }
    })

    console.log('User found:', user)
    console.log('User avatar:', user?.avatar)

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's store if they have one
    const userStore = await prisma.store.findFirst({
      where: { userId },
      select: {
        id: true,
        name: true,
        publicKey: true,
      }
    })

    const responseData = {
      user: {
        ...user,
        avatar: user.avatar ? `/uploads/profiles/${user.avatar}` : null,
        joinDate: user.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }),
        stats: {
          productsCount: user._count.products,
          storesCount: user._count.stores,
          wishlistCount: user._count.wishlist,
        }
      },
      store: userStore
    }

    console.log('Response data:', responseData)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const userId = parseInt(session.user.id)

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        // Note: address field doesn't exist in User model, you might need to add it
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        avatar: updatedUser.avatar ? `/uploads/profiles/${updatedUser.avatar}` : null,
        joinDate: updatedUser.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })
      },
      message: 'Profile updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}