
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import * as z from "zod"
import { prisma } from '@/lib/prisma';

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  token: z.string().min(1, { message: "Token is required." }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password, token } = resetPasswordSchema.parse(body)

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!passwordResetToken || new Date() > passwordResetToken.expires) {
      return new NextResponse("Invalid or expired token", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
