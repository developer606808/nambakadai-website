import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as z from "zod";
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// Schema for changing password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string()
    .min(8, { message: "New password must be at least 8 characters." })
    .regex(/[0-9]/, { message: "New password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "New password must contain at least one special character." }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, existingUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid current password.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error changing password:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
