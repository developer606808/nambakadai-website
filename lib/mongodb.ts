import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nambakadai-chat'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log('Attempting to connect to MongoDB:', MONGODB_URI)
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Successfully connected to MongoDB')
      return mongoose
    }).catch((error) => {
      console.error('❌ Failed to connect to MongoDB:', error.message)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
    console.log('✅ MongoDB connection ready')
  } catch (e) {
    console.error('❌ MongoDB connection error:', e)
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectToDatabase