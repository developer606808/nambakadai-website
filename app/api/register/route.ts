
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import * as z from "zod"
import crypto from "crypto"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

const registerUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = registerUserSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.emailVerificationToken.create({
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
      subject: "Verify your email address",
      html: `<p>Click <a href="http://localhost:3000/verify-email?token=${token}">here</a> to verify your email address.</p>`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
