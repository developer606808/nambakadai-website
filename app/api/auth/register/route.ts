import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import bcrypt from 'bcryptjs'
import { signupSchema, isEmailSuspicious } from '@/lib/validations/auth'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/services/emailService'
import { logFailedLogin } from '@/lib/services/loginLogService'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with enhanced schema
    const validatedData = signupSchema.parse(body)

    // Additional spam/suspicious email checks
    if (isEmailSuspicious(validatedData.email)) {
      await logFailedLogin(validatedData.email, request, 'Suspicious email detected')
      return NextResponse.json(
        { error: 'This email address is not allowed. Please use a valid email address.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      await logFailedLogin(validatedData.email, request, 'Email already exists')
      return NextResponse.json(
        { error: 'An account with this email already exists. Please try logging in instead.' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: 'BUYER', // All new users start as BUYER
        isVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
        deviceToken: validatedData.deviceToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(
      validatedData.email,
      validatedData.name,
      verificationToken
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Don't fail registration if email fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user,
        emailSent: emailResult.success
      },
      { status: 201 }
    )
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

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
