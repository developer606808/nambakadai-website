
import { NextResponse } from "next/server"
import * as z from "zod"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { prisma } from '@/lib/prisma';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist
      return new NextResponse(null, { status: 204 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    })

    const transporter = nodemailer.createTransport({
      // Replace with your email provider's configuration
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "user@example.com",
        pass: "password",
      },
    })

    const mailOptions = {
      from: '"Nambakadai" <no-reply@nambakadai.com>',
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click <a href="http://localhost:3000/reset-password?token=${token}">here</a> to reset your password.</p>`,
    }

    await transporter.sendMail(mailOptions)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
