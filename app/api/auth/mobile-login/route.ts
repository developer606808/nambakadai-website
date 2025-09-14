import { NextRequest, NextResponse } from 'next/server'
import admin from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { logSuccessfulLogin, logFailedLogin } from '@/lib/services/loginLogService'

export async function POST(request: NextRequest) {
  try {
    const { idToken, deviceToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const firebaseUid = decodedToken.uid
    const email = decodedToken.email

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user in database
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create new user if doesn't exist in database
      user = await prisma.user.create({
        data: {
          email,
          name: decodedToken.name || email.split('@')[0],
          password: '', // Firebase handles authentication, password not needed
          isVerified: decodedToken.email_verified || false,
          avatar: decodedToken.picture || null,
          deviceToken: deviceToken || null,
        }
      })
    } else {
      // Update existing user with latest Firebase info and device token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: decodedToken.name || user.name,
          isVerified: decodedToken.email_verified || user.isVerified,
          avatar: decodedToken.picture || user.avatar,
          ...(deviceToken && { deviceToken }),
        }
      })
    }

    // Log successful login
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await logSuccessfulLogin(user.id, {
      ipAddress,
      userAgent,
      deviceToken
    } as any)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      }
    })

  } catch (error) {
    console.error('Mobile login error:', error)

    if (error instanceof Error && error.message.includes('auth')) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}