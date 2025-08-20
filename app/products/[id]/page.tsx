
import { PrismaClient } from "@prisma/client"
import Image from "next/image"
import { Star, MapPin, Users, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"

const prisma = new PrismaClient()

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      store: { include: { owner: true } },
    },
  })
  return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.category.name}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">${product.price.toFixed(2)}</p>
            <p className="mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-bold">4.5</span>
              <span className="text-gray-500 ml-2">(128 reviews)</span>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">About the seller</h2>
              <div className="flex items-center">
                <Image
                  src={product.store.owner.image || "/placeholder-user.jpg"}
                  alt={product.store.owner.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">{product.store.name}</p>
                  <p className="text-gray-500">{product.store.owner.name}</p>
                </div>
              </div>
            </div>
            <Button size="lg">Add to Cart</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
