import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465', // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const imageFile = formData.get('image') as File | null;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    let imageUrl: string | null = null;
    if (imageFile) {
      // Make an internal request to the image upload API
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload-image`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        return NextResponse.json({ message: errorData.message || 'Image upload failed' }, { status: uploadResponse.status });
      }

      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.imageUrl;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        image: imageUrl,
        isVerified: false, // User is not verified initially
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // Token valid for 1 hour

    await prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expires,
      },
    });

    // Send verification email
    const verificationLink = `${request.nextUrl.origin}/verify-email?token=${verificationToken}`;

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
      // Optionally, handle this error more gracefully, e.g., log it but still create user
    }

    console.log('User created by Prisma:', user);

    return NextResponse.json({ message: 'User registered successfully. Please check your email for verification link.', user: { id: user.id, email: user.email, name: user.name, image: user.image } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}