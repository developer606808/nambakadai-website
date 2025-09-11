import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/data/prisma'
import { uploadProfileImageGCS } from '@/lib/utils/gcs-upload'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('profileImage') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Upload file using centralized utility
    const uploadResult = await uploadProfileImageGCS(file, session.user.id)

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 500 }
      )
    }

    // Update user avatar in database
    const avatarUrl = uploadResult.fileName! // Store just the filename, not the full path

    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { avatar: avatarUrl }
    })

    return NextResponse.json({
      success: true,
      avatar: avatarUrl,
      message: 'Profile image uploaded successfully'
    })

  } catch (error) {
    console.error('Profile upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile image' },
      { status: 500 }
    )
  }
}