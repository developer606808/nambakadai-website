import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import { resendVerificationSchema } from '@/lib/validations/auth'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/services/emailService'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const { email } = resendVerificationSchema.parse(body)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists and is not verified, a verification email has been sent.'
      })
    }
    
    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'This email is already verified' },
        { status: 400 }
      )
    }
    
    // Check rate limiting - don't allow resending too frequently
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    
    if (user.emailVerificationExpiry && user.emailVerificationExpiry > fiveMinutesAgo) {
      const timeLeft = Math.ceil((user.emailVerificationExpiry.getTime() - now.getTime()) / 1000 / 60)
      return NextResponse.json(
        { error: `Please wait ${timeLeft} minutes before requesting another verification email` },
        { status: 429 }
      )
    }
    
    // Generate new verification token
    const verificationToken = generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      }
    })
    
    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      user.name,
      verificationToken
    )
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully! Please check your inbox.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
