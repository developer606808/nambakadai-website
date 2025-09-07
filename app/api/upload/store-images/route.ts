import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { uploadStoreImageServer } from '@/lib/utils/file-upload-server'

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Validate file
function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size must be less than 5MB' }
  }

  return { isValid: true }
}

// Generate unique filename
function generateFileName(originalName: string, type: 'logo' | 'banner'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${type}_${timestamp}_${random}.${extension}`
}

// Upload directory is now handled by the centralized utility

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a seller or admin
    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only sellers and admins can upload store images' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'logo' | 'banner'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !['logo', 'banner'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "logo" or "banner"' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload file using centralized utility
    const uploadResult = await uploadStoreImageServer(file, type)

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 400 }
      )
    }

    const publicUrl = uploadResult.url!
    const fileName = uploadResult.fileName!

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Store image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// GET method to retrieve uploaded images (optional)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a seller or admin
    if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only sellers and admins can access store images' },
        { status: 403 }
      )
    }

    // This could be used to list uploaded images for a user
    // For now, just return a success response
    return NextResponse.json({
      message: 'Store images endpoint is working'
    })

  } catch (error) {
    console.error('Store images GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
