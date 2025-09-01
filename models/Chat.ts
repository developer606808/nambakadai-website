import mongoose, { Schema, Document } from 'mongoose'

export interface IChat extends Document {
  _id: string
  participants: string[] // Array of user IDs (store owner and customer)
  storeId: string // Store ID for easier querying
  customerId: string // Customer user ID
  storeOwnerId: string // Store owner user ID
  lastMessage?: {
    content: string
    senderId: string
    timestamp: Date
  }
  unreadCount: {
    [userId: string]: number // Unread count per user
  }
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>({
  participants: [{
    type: String,
    required: true
  }],
  storeId: {
    type: String,
    required: true,
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  storeOwnerId: {
    type: String,
    required: true,
    index: true
  },
  lastMessage: {
    content: String,
    senderId: String,
    timestamp: Date
  },
  unreadCount: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Pre-save middleware to handle Map to Object conversion
ChatSchema.pre('save', function(next) {
  if (this.unreadCount instanceof Map) {
    // Convert Map to plain object
    const obj: { [key: string]: number } = {}
    for (const [key, value] of this.unreadCount) {
      obj[key] = value
    }
    this.unreadCount = obj
  }
  next()
})

// Post-find middleware to handle Map to Object conversion for retrieved documents
ChatSchema.post('find', function(docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      if (doc && doc.unreadCount instanceof Map) {
        const obj: { [key: string]: number } = {}
        for (const [key, value] of doc.unreadCount) {
          obj[key] = value
        }
        doc.unreadCount = obj
      }
    })
  }
})

ChatSchema.post('findOne', function(doc) {
  if (doc && doc.unreadCount instanceof Map) {
    const obj: { [key: string]: number } = {}
    for (const [key, value] of doc.unreadCount) {
      obj[key] = value
    }
    doc.unreadCount = obj
  }
})

// Compound index for efficient querying
ChatSchema.index({ storeId: 1, customerId: 1 }, { unique: true })
ChatSchema.index({ participants: 1 })

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)