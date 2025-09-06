import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import connectToDatabase from '@/lib/mongodb'
import Chat from '@/models/Chat'
import Message from '@/models/Message'

// GET - Fetch messages for a specific chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
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
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = session.user.id
    const { chatId } = await params

    // Verify user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      )
    }

    // Handle Map to Object conversion for existing documents
    if (chat.unreadCount instanceof Map) {
      const obj: { [key: string]: number } = {}
      for (const [key, value] of chat.unreadCount) {
        obj[key] = value
      }
      chat.unreadCount = obj
      await chat.save()
    }

    // Fetch messages
    console.log('Fetching messages for chatId:', chatId, 'userId:', userId)
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    console.log('Found messages:', messages.length, messages)

    // Mark messages as read
    const updateResult = await Message.updateMany(
      {
        chatId,
        receiverId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    )
    console.log('Messages marked as read:', updateResult.modifiedCount)

    // Update unread count in chat
    const updatedUnreadCount = await Message.countDocuments({
      chatId,
      receiverId: userId,
      isRead: false
    })

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
      [userId]: updatedUnreadCount
    }
    await chat.save()

    return NextResponse.json({
      messages: messages.map(msg => ({
        id: msg._id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        messageType: msg.messageType,
        isRead: msg.isRead,
        readAt: msg.readAt,
        attachments: msg.attachments,
        metadata: msg.metadata,
        createdAt: msg.createdAt
      })),
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    })

  } catch (error) {
    console.error('Chat messages GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST - Send message to specific chat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, messageType = 'text', attachments = [], metadata = {} } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const senderId = session.user.id
    const { chatId } = await params

    // Verify user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      )
    }

    // Determine receiver
    const receiverId = chat.participants.find((p: string) => p !== senderId)

    // Create message
    console.log('Creating message:', { chatId, senderId, receiverId, content })
    const message = new Message({
      chatId,
      senderId,
      receiverId,
      content,
      messageType,
      attachments,
      metadata
    })

    const savedMessage = await message.save()
    console.log('Message saved:', savedMessage._id, savedMessage.content)

    // Update chat's last message and unread count
    chat.lastMessage = {
      content,
      senderId,
      timestamp: message.createdAt
    }

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
      [receiverId]: (currentUnreadCount[receiverId] || 0) + 1
    }

    await chat.save()

    // Send push notification to receiver
    try {
      const notificationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: receiverId,
          title: 'New Message',
          body: `You have a new message: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
          data: {
            chatId: chatId,
            senderId: senderId,
            messageType: 'chat_message',
            url: `/messages?chat=${chatId}`
          }
        }),
      })

      if (!notificationResponse.ok) {
        console.error('Failed to send push notification')
      }
    } catch (error) {
      console.error('Error sending push notification:', error)
      // Don't fail the message sending if push notification fails
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        chatId: message.chatId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        isRead: message.isRead,
        attachments: message.attachments,
        metadata: message.metadata,
        createdAt: message.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Chat message POST error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}