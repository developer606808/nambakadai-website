import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { Chat } from '@/lib/data/models';
import connectMongo from '@/lib/data/connectMongo';

// GET /api/chat/:userId - Get chat messages between current user and another user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch messages between the two users
    const messages = await Chat.find({
      $or: [
        { senderId: session.user.id, receiverId: params.userId },
        { senderId: params.userId, receiverId: session.user.id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name')
    .populate('receiverId', 'name')
    .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Send a new message
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request, { limit: 'api' });
    if (rateLimitResponse) return rateLimitResponse;

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Parse request body
    const body = await request.json();
    const { receiverId, message } = body;

    if (!receiverId || !message) {
      return NextResponse.json(
        { error: 'Receiver ID and message are required' },
        { status: 400 }
      );
    }

    // Create new message
    const chatMessage = new Chat({
      senderId: session.user.id,
      receiverId,
      message
    });

    const savedMessage = await chatMessage.save();

    // Populate user info
    await savedMessage.populate('senderId', 'name');
    await savedMessage.populate('receiverId', 'name');

    return NextResponse.json(savedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json(
      { error: 'Failed to send chat message' },
      { status: 500 }
    );
  }
}