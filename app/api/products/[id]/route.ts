
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import * as z from "zod"
import { prisma } from '@/lib/prisma';

const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).optional(),
  description: z.string().min(1, { message: "Description is required." }).optional(),
  price: z.number().min(0, { message: "Price must be a positive number." }).optional(),
  categoryId: z.string().min(1, { message: "Category is required." }).optional(),
  images: z.array(z.string().url()).optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return new NextResponse("Product not found", { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SELLER") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { store: true },
    })

    if (!product || product.store.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, categoryId, images } = updateProductSchema.parse(body)

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        categoryId,
        images,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SELLER") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { store: true },
    })

    if (!product || product.store.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
