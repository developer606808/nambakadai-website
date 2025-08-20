import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  console.log('Verification API: Received token', token);

  if (!token) {
    console.log('Verification API: No token provided');
    return NextResponse.json(
      { message: 'No verification token found.' },
      { status: 400 }
    );
  }

  try {
    const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    console.log('Verification API: Found token in DB', emailVerificationToken);

    if (!emailVerificationToken || emailVerificationToken.expires < new Date()) {
      console.log('Verification API: Token invalid or expired');
      return NextResponse.json(
        { message: 'Verification failed: Token expired or already used.' },
        { status: 400 }
      );
    }

    // Mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: emailVerificationToken.userId },
      data: { isVerified: true },
    });

    console.log('Verification API: User updated', updatedUser);

    // Delete the used token
    await prisma.emailVerificationToken.delete({
      where: { id: emailVerificationToken.id },
    });

    console.log('Verification API: Token deleted');

    return NextResponse.json(
      { message: 'Email successfully verified!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Verification failed: An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
