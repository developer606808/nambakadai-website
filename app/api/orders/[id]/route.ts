
import { OrderStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import * as z from "zod"
import { prisma } from '@/lib/prisma';

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: { include: { store: true } } } },
        user: true,
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    const isOwner = order.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: { include: { store: true } } } },
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    const isSeller = order.items.some((item) => item.product.store.ownerId === session.user.id)
    const isAdmin = session.user.role === "ADMIN"

    if (!isSeller && !isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { status } = updateOrderSchema.parse(body)

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
