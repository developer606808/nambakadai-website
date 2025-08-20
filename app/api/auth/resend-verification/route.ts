import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!emailVerificationToken || !emailVerificationToken.user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }

    const user = emailVerificationToken.user;

    if (user.isVerified) {
      return NextResponse.json({ message: 'Email is already verified.' }, { status: 200 });
    }

    await prisma.emailVerificationToken.delete({
      where: { id: emailVerificationToken.id },
    });

    const newVerificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        token: newVerificationToken,
        userId: user.id,
        expires,
      },
    });

    const verificationLink = `${request.nextUrl.origin}/verify-email?token=${newVerificationToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your email address',
        html: `<p>Hello ${user.name},</p>
               <p>Please verify your email address by clicking on the link below:</p>
               <p><a href="${verificationLink}">Verify Email</a></p>
               <p>This link will expire in 1 hour.</p>`,
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return NextResponse.json({ message: 'Failed to send verification email.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'New verification email sent. Please check your inbox.' }, { status: 200 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}