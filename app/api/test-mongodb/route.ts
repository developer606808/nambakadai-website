import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Chat from '@/models/Chat'
import Message from '@/models/Message'

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection and operations...')

    // Test connection
    await connectToDatabase()
    console.log('✅ MongoDB connection successful')

    // Test Chat collection
    const chatCount = await Chat.countDocuments()
    console.log('📊 Total chats in database:', chatCount)

    // Test Message collection
    const messageCount = await Message.countDocuments()
    console.log('📨 Total messages in database:', messageCount)

    // Get recent chats
    const recentChats = await Chat.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean()

    console.log('📋 Recent chats:', recentChats.map(chat => ({
      id: chat._id,
      storeId: chat.storeId,
      participants: chat.participants,
      updatedAt: chat.updatedAt
    })))

    // Get recent messages
    const recentMessages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    console.log('💬 Recent messages:', recentMessages.map(msg => ({
      id: msg._id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      content: msg.content?.substring(0, 50) + (msg.content?.length > 50 ? '...' : ''),
      createdAt: msg.createdAt
    })))

    return NextResponse.json({
      success: true,
      message: 'MongoDB test completed successfully',
      stats: {
        chatCount,
        messageCount,
        recentChats: recentChats.length,
        recentMessages: recentMessages.length
      },
      connection: 'OK'
    })

  } catch (error) {
    console.error('❌ MongoDB test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'MongoDB test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      connection: 'FAILED'
    }, { status: 500 })
  }
}