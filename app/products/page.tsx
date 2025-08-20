import Image from "next/image"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"

export default function ProductsPage() {
  // Mock data for products
  const products = [
    {
      id: 1,
      name: "Homemade Fruit Jam",
      image: "/placeholder.svg?height=200&width=200",
      price: 6.5,
      rating: 4.7,
      location: "Nagano, Japan",
      category: "Snacks",
      featured: false,
      new: false,
    },
    {
      id: 2,
      name: "Tractor Rental (Daily)",
      image: "/placeholder.svg?height=200&width=200",
      price: 75.0,
      rating: 4.6,
      location: "Saitama, Japan",
      category: "Rentals",
      featured: false,
      new: false,
    },
    {
      id: 3,
      name: "Organic Honey",
      image: "/placeholder.svg?height=200&width=200",
      price: 8.99,
      rating: 4.8,
      location: "Fukuoka, Japan",
      category: "Organic",
      featured: false,
      new: false,
    },
    {
      id: 4,
      name: "Handcrafted Wooden Planter",
      image: "/placeholder.svg?height=200&width=200",
      price: 24.99,
      rating: 4.5,
      location: "Nara, Japan",
      category: "Plants",
      featured: false,
      new: true,
    },
    {
      id: 5,
      name: "Farm Fresh Eggs",
      image: "/placeholder.svg?height=200&width=200",
      price: 4.5,
      rating: 4.9,
      location: "Kyoto, Japan",
      category: "Organic",
      featured: true,
      new: false,
    },
    {
      id: 6,
      name: "Organic Brown Rice",
      image: "/placeholder.svg?height=200&width=200",
      price: 5.99,
      rating: 4.7,
      location: "Niigata, Japan",
      category: "Grains",
      featured: true,
      new: false,
    },
    {
      id: 7,
      name: "Heirloom Tomatoes",
      image: "/placeholder.svg?height=200&width=200",
      price: 2.49,
      rating: 4.6,
      location: "Hokkaido, Japan",
      category: "Vegetables",
      featured: true,
      new: false,
    },
    {
      id: 8,
      name: "Fresh Organic Apples",
      image: "/placeholder.svg?height=200&width=200",
      price: 3.99,
      rating: 4.8,
      location: "Aomori, Japan",
      category: "Fruits",
      featured: true,
      new: false,
    },
  ]

  // Categories for filtering
  const categories = ["All Categories", "Fruits", "Vegetables", "Organic", "Grains", "Plants", "Rentals", "Snacks"]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-600">Find fresh and organic products from local farmers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input type="text" placeholder="Search products..." className="pr-10 w-full" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select className="border rounded-md px-3 py-2 bg-white">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-green-500 hover:bg-green-600" : ""}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="inline-block bg-gray-100 rounded-md px-2 py-1 text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  {product.new && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">📍 {product.location}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-medium text-green-600">${product.price.toFixed(2)}</div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
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
