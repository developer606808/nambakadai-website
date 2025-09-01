import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  _id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  messageType: 'text' | 'image' | 'file' | 'system'
  isRead: boolean
  readAt?: Date
  attachments?: string[]
  metadata?: {
    productId?: string
    storeId?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  chatId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true,
    index: true
  },
  receiverId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  attachments: [{
    type: String
  }],
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Compound indexes for efficient querying
MessageSchema.index({ chatId: 1, createdAt: -1 })
MessageSchema.index({ senderId: 1, createdAt: -1 })
MessageSchema.index({ receiverId: 1, isRead: 1 })

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)