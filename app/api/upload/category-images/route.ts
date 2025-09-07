import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { uploadCategoryImageServer } from '@/lib/utils/file-upload-server'

// Configuration
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Validate file
function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size must be less than 2MB' }
  }

  return { isValid: true }
}

// Generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `category_${timestamp}_${random}.${extension}`
}

// Upload directory is now handled by the centralized utility

export async function POST(request: NextRequest) {
  try {
    // Check authentication - support both NextAuth sessions and admin tokens
    const session = await getServerSession(authOptions)
    const authHeader = request.headers.get('authorization')
    const adminToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    // Check if user is authenticated via NextAuth OR has valid admin token
    const isAuthenticated = session || (adminToken === 'demo-admin-token')

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has appropriate role (for NextAuth sessions)
    if (session && session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only sellers and admins can access category images' },
        { status: 403 }
      )
    }

    // Check if user has appropriate role (for NextAuth sessions)
    if (session && session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only sellers and admins can upload category images' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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
    console.log('Uploading category image using centralized utility...')
    const uploadResult = await uploadCategoryImageServer(file)

    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Failed to upload file')
    }

    const publicUrl = uploadResult.url!
    const fileName = uploadResult.fileName!

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
      message: 'Category image uploaded successfully'
    })

  } catch (error) {
    console.error('Category image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication - support both NextAuth sessions and admin tokens
    const session = await getServerSession(authOptions)
    const authHeader = request.headers.get('authorization')
    const adminToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    // Check if user is authenticated via NextAuth OR has valid admin token
    const isAuthenticated = session || (adminToken === 'demo-admin-token')

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Category images endpoint is working',
      maxSize: '2MB',
      allowedTypes: ALLOWED_TYPES
    })

  } catch (error) {
    console.error('Category images GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}