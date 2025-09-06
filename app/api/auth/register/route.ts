import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import bcrypt from 'bcryptjs'
import { signupSchema, isEmailSuspicious } from '@/lib/validations/auth'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/services/emailService'
import { logFailedLogin } from '@/lib/services/loginLogService'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get('name')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const phone = formData.get('phone')?.toString() || undefined
    const password = formData.get('password')?.toString() || ''
    const confirmPassword = formData.get('confirmPassword')?.toString() || ''
    const acceptTerms = formData.get('acceptTerms') === 'true'
    const deviceToken = formData.get('deviceToken')?.toString() || undefined
    const profileImageFile = formData.get('profileImage') as File | null

    // Create validation object
    const validationData = {
      name,
      email,
      phone,
      password,
      confirmPassword,
      acceptTerms,
      deviceToken
    }

    // Validate input with enhanced schema
    const validatedData = signupSchema.parse(validationData)

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

    // Handle profile image upload
    let avatarUrl = null
    if (profileImageFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(profileImageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (profileImageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = profileImageFile.name.split('.').pop()
      const filename = `profile-${timestamp}-signup.${extension}`

      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles')
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Convert file to buffer and save
      const bytes = await profileImageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      avatarUrl = filename // Store just the filename, not the full path
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        avatar: avatarUrl,
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
        avatar: true,
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

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Invalid request format. Please try again.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
