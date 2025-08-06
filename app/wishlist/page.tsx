import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"

export default function WishlistPage() {
  // Mock wishlist data
  const wishlistItems = [
    {
      id: "1",
      name: "Organic Apples",
      image: "/placeholder.svg?height=100&width=100",
      price: 3.99,
      inStock: true,
    },
    {
      id: "2",
      name: "Fresh Strawberries",
      image: "/placeholder.svg?height=100&width=100",
      price: 4.5,
      inStock: true,
    },
    {
      id: "3",
      name: "Heirloom Tomatoes",
      image: "/placeholder.svg?height=100&width=100",
      price: 5.99,
      inStock: false,
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you like for future reference</p>
            <Link href="/products">
              <Button className="bg-green-500 hover:bg-green-600">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{wishlistItems.length} Items</h2>
                <Button variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="divide-y">
              {wishlistItems.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-green-600 font-medium">${item.price.toFixed(2)}</p>
                      {!item.inStock && (
                        <span className="ml-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={!item.inStock ? "opacity-50 cursor-not-allowed" : ""}
                      disabled={!item.inStock}
                    >
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
