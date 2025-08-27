import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/main-layout"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1)

  // Mock data for category products
  const products = [
    {
      id: 1,
      name: "Organic Apples",
      image: "/placeholder.svg?height=200&width=200",
      price: 3.99,
      rating: 4.8,
      reviews: 128,
      location: "Oakland, CA",
      seller: "Green Valley Farms",
      isOrganic: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      image: "/placeholder.svg?height=200&width=200",
      price: 4.5,
      rating: 4.7,
      reviews: 86,
      location: "San Jose, CA",
      seller: "Berry Farm",
      isBestSeller: true,
    },
    {
      id: 3,
      name: "Organic Bananas",
      image: "/placeholder.svg?height=200&width=200",
      price: 2.99,
      rating: 4.6,
      reviews: 152,
      location: "Santa Cruz, CA",
      seller: "Tropical Farms",
      isOrganic: true,
    },
    {
      id: 4,
      name: "Fresh Oranges",
      image: "/placeholder.svg?height=200&width=200",
      price: 3.49,
      rating: 4.9,
      reviews: 210,
      location: "Palo Alto, CA",
      seller: "Citrus Grove",
      isBestSeller: true,
    },
    {
      id: 5,
      name: "Organic Grapes",
      image: "/placeholder.svg?height=200&width=200",
      price: 5.99,
      rating: 4.5,
      reviews: 94,
      location: "Napa Valley, CA",
      seller: "Vineyard Fresh",
      isOrganic: true,
    },
    {
      id: 6,
      name: "Fresh Pineapple",
      image: "/placeholder.svg?height=200&width=200",
      price: 4.99,
      rating: 4.7,
      reviews: 68,
      location: "San Francisco, CA",
      seller: "Tropical Delights",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-6">
            <h1 className="text-4xl font-bold mb-2">{category}</h1>
            <p className="text-gray-600 text-lg">Fresh and organic {category.toLowerCase()} from local farmers</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input type="text" placeholder={`Search ${category.toLowerCase()}...`} className="pr-10 w-full" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <select className="border rounded-md px-3 py-2 bg-white">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest First</option>
              </select>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
            {["All", "Organic", "Local", "Best Sellers", "New Arrivals"].map((filter, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "bg-green-500 hover:bg-green-600" : ""}
                size="sm"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <div className="absolute top-2 left-2">
                  {product.isOrganic && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Organic</span>
                  )}
                </div>
                {product.isBestSeller && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                    Best Seller
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">📍 {product.location}</div>
                <div className="text-xs text-gray-500 mb-3">by {product.seller}</div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-green-600">${product.price.toFixed(2)}</div>
                  <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors" asChild>
                    <Link href={`/products/${product.id}`}>More Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </nav>
        </div>
      </div>
    </MainLayout>
  )
}
