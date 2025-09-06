import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { fcmToken } = await request.json()

    if (!fcmToken) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      )
    }

    // Update user's FCM token
    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { fcmToken }
    })

    return NextResponse.json({
      success: true,
      message: 'FCM token updated successfully'
    })

  } catch (error) {
    console.error('Update FCM token error:', error)
    return NextResponse.json(
      { error: 'Failed to update FCM token' },
      { status: 500 }
    )
  }
}