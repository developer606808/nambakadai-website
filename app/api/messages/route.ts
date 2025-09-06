import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch messages for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      // Fetch messages for specific conversation
      const messages = await prisma.message.findMany({
        where: {
          conversationId: parseInt(conversationId),
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          conversationId: parseInt(conversationId),
          receiverId: userId,
          isRead: false
        },
        data: { isRead: true }
      })

      return NextResponse.json({ messages })
    } else {
      // Fetch conversations list
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [
            { participant1Id: userId },
            { participant2Id: userId }
          ]
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          participant1: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          participant2: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  receiverId: userId,
                  isRead: false
                }
              }
            }
          }
        }
      })

      const transformedConversations = conversations.map(conv => {
        const otherParticipant = conv.participant1Id === userId ? conv.participant2 : conv.participant1
        const lastMessage = conv.messages[0]
        
        return {
          id: conv.id,
          participant: otherParticipant,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderName: lastMessage.sender.name,
            isFromMe: lastMessage.senderId === userId
          } : null,
          unreadCount: conv._count.messages,
          updatedAt: conv.updatedAt
        }
      })

      return NextResponse.json({ conversations: transformedConversations })
    }

  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST - Send new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const senderId = parseInt(session.user.id)
    if (isNaN(senderId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const { receiverId, content, conversationId } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      )
    }

    const receiverIdInt = parseInt(receiverId)
    if (isNaN(receiverIdInt)) {
      return NextResponse.json(
        { error: 'Invalid receiver ID' },
        { status: 400 }
      )
    }

    let conversation
    
    if (conversationId) {
      // Use existing conversation
      conversation = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) }
      })
    } else {
      // Find or create conversation
      conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { participant1Id: senderId, participant2Id: receiverIdInt },
            { participant1Id: receiverIdInt, participant2Id: senderId }
          ]
        }
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participant1Id: senderId,
            participant2Id: receiverIdInt
          }
        })
      }
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to find or create conversation' },
        { status: 500 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        receiverId: receiverIdInt,
        content,
        messageType: 'TEXT'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message,
      conversationId: conversation.id
    }, { status: 201 })

  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PUT - Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const { conversationId, messageIds } = await request.json()

    if (conversationId) {
      // Mark all messages in conversation as read
      await prisma.message.updateMany({
        where: {
          conversationId: parseInt(conversationId),
          receiverId: userId,
          isRead: false
        },
        data: { isRead: true }
      })
    } else if (messageIds && Array.isArray(messageIds)) {
      // Mark specific messages as read
      await prisma.message.updateMany({
        where: {
          id: { in: messageIds.map((id: string) => parseInt(id)) },
          receiverId: userId
        },
        data: { isRead: true }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    })

  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
