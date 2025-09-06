import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPushNotification } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { userId, title, body, data } = await request.json()

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'User ID, title, and body are required' },
        { status: 400 }
      )
    }

    // Get user's FCM token
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { fcmToken: true, name: true }
    })

    if (!user?.fcmToken) {
      return NextResponse.json(
        { error: 'User not found or no FCM token available' },
        { status: 404 }
      )
    }

    // Send push notification
    const notificationData = {
      title,
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      clickAction: data?.url || '/',
      data: {
        userId: userId.toString(),
        ...data
      }
    }

    const result = await sendPushNotification(user.fcmToken, notificationData)

    if (result) {
      // Store notification in database
      await prisma.notification.create({
        data: {
          userId: parseInt(userId),
          title,
          message: body,
          type: 'NEW_MESSAGE',
          relatedId: data?.chatId ? parseInt(data.chatId) : null,
          relatedType: 'chat',
          actionUrl: data?.url
        }
      })

      return NextResponse.json({
        success: true,
        messageId: result
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send push notification' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}