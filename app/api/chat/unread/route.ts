import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import connectToDatabase from '@/lib/mongodb'
import Message from '@/models/Message'

// GET - Get unread message count for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const userId = session.user.id

    // Count total unread messages
    const totalUnreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    })

    // Get unread count per chat for more detailed info
    const unreadByChat = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          isRead: false
        }
      },
      {
        $group: {
          _id: '$chatId',
          count: { $sum: 1 }
        }
      }
    ])

    return NextResponse.json({
      totalUnreadCount,
      unreadByChat: unreadByChat.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Unread count GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
}