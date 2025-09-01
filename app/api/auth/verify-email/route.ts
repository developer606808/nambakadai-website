import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import { emailVerificationSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const { token } = emailVerificationSchema.parse(body)
    
    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }
    
    // Update user as verified and clear verification token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: updatedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid verification token format' },
        { status: 400 }
      )
    }
    
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method for email verification via URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }
    
    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }
    
    // Update user as verified and clear verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      }
    })
    
    // Redirect to login page with success message
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('verified', 'true')
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Email verification error:', error)
    
    // Redirect to login page with error
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('error', 'verification_failed')
    
    return NextResponse.redirect(redirectUrl)
  }
}
