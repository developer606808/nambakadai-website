import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import connectToDatabase from '@/lib/mongodb'
import Chat from '@/models/Chat'
import Message from '@/models/Message'

// GET - Fetch user's chats
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const userId = session.user.id

    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: userId
    })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

    // Get total unread count for user
    const totalUnreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    })

    // Transform chats with additional data
    const transformedChats = await Promise.all(
      chats.map(async (chat) => {
        // Get latest message
        const latestMessage = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .lean()

        // Get unread count for this chat
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          receiverId: userId,
          isRead: false
        })

        return {
          id: chat._id,
          storeId: chat.storeId,
          customerId: chat.customerId,
          storeOwnerId: chat.storeOwnerId,
          participants: chat.participants,
          lastMessage: latestMessage && typeof latestMessage === 'object' && !Array.isArray(latestMessage) ? {
            content: (latestMessage as any).content,
            senderId: (latestMessage as any).senderId,
            timestamp: (latestMessage as any).createdAt,
            messageType: (latestMessage as any).messageType
          } : null,
          unreadCount,
          updatedAt: chat.updatedAt
        }
      })
    )

    return NextResponse.json({
      chats: transformedChats,
      totalUnreadCount,
      pagination: {
        page,
        limit,
        hasMore: chats.length === limit
      }
    })

  } catch (error) {
    console.error('Chat GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}

// POST - Send new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { storeId, content, messageType = 'text', attachments = [], metadata = {} } = await request.json()

    if (!storeId || !content) {
      return NextResponse.json(
        { error: 'Store ID and content are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const senderId = session.user.id

    // Get store owner from existing PostgreSQL database
    const storeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/stores/${storeId}`)
    if (!storeResponse.ok) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    const storeData = await storeResponse.json()
    const storeOwnerId = storeData.userId.toString()

    // Find or create chat
    console.log('Finding/creating chat for storeId:', storeId, 'customerId:', senderId, 'storeOwnerId:', storeOwnerId)
    let chat = await Chat.findOne({
      storeId,
      customerId: senderId,
      storeOwnerId
    })

    if (!chat) {
      console.log('Creating new chat')
      chat = new Chat({
        participants: [senderId, storeOwnerId],
        storeId,
        customerId: senderId,
        storeOwnerId,
        unreadCount: {
          [storeOwnerId]: 1
        }
      })
      await chat.save()
      console.log('New chat created with ID:', chat._id)
    } else {
      console.log('Found existing chat with ID:', chat._id)
      // Update unread count for receiver
      // Handle both Map and Object types for unreadCount
      let currentUnreadCount: { [key: string]: number } = {}

      if (chat.unreadCount instanceof Map) {
        // Convert Map to Object
        for (const [key, value] of chat.unreadCount) {
          currentUnreadCount[key] = value
        }
      } else if (typeof chat.unreadCount === 'object' && chat.unreadCount !== null) {
        // It's already an object
        currentUnreadCount = chat.unreadCount as { [key: string]: number }
      }

      chat.unreadCount = {
        ...currentUnreadCount,
        [storeOwnerId]: (currentUnreadCount[storeOwnerId] || 0) + 1
      }
      await chat.save()
    }

    // Create message
    console.log('Creating message for chat:', chat._id)
    const message = new Message({
      chatId: chat._id,
      senderId,
      receiverId: storeOwnerId,
      content,
      messageType,
      attachments,
      metadata: {
        ...metadata,
        storeId
      }
    })

    const savedMessage = await message.save()
    console.log('Message saved with ID:', savedMessage._id)

    // Update chat's last message
    chat.lastMessage = {
      content,
      senderId,
      timestamp: message.createdAt
    }
    await chat.save()

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        chatId: chat._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        attachments: message.attachments,
        metadata: message.metadata,
        createdAt: message.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Chat POST error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}