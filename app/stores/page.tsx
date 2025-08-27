import Image from "next/image"
import Link from "next/link"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/main-layout"

export default function StoresPage() {
  // Mock data for stores
  const stores = [
    {
      id: 1,
      name: "Green Valley Farm",
      image: "/placeholder.svg?height=300&width=300",
      description: "Sustainable farming practices with a wide range of organic products.",
      location: "Bangalore, Karnataka",
      rating: 4.6,
      reviews: 18,
      tags: ["Vegetables", "Organic"],
      verified: true,
    },
    {
      id: 2,
      name: "Pet Paradise",
      image: "/placeholder.svg?height=300&width=300",
      description: "Everything you need for your pets - from food to accessories.",
      location: "Hyderabad, Telangana",
      rating: 4.7,
      reviews: 32,
      tags: ["Pets"],
      verified: false,
    },
    {
      id: 3,
      name: "Farm Equipment Rentals",
      image: "/placeholder.svg?height=300&width=300",
      description: "Quality farm equipment available for daily and weekly rentals.",
      location: "Coimbatore, Tamil Nadu",
      rating: 4.5,
      reviews: 15,
      tags: ["Rentals"],
      verified: true,
    },
    {
      id: 4,
      name: "Nature's Basket",
      image: "/placeholder.svg?height=300&width=300",
      description: "Premium quality fruits, vegetables, and organic products.",
      location: "Mumbai, Maharashtra",
      rating: 4.9,
      reviews: 42,
      tags: ["Fruits", "Vegetables", "Organic"],
      verified: true,
    },
    {
      id: 5,
      name: "Grain Wholesalers",
      image: "/placeholder.svg?height=300&width=300",
      description: "Bulk grains and cereals at wholesale prices.",
      location: "Delhi, Delhi",
      rating: 4.4,
      reviews: 28,
      tags: ["Grains"],
      verified: false,
    },
  ]

  // Categories for filtering
  const categories = ["All Categories", "Fruits", "Vegetables", "Organic", "Pets", "Rentals", "Grains"]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Stores</h1>
          <p className="text-gray-600">Discover local stores and farmers on Nanbakadai</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input type="text" placeholder="Search stores..." className="pr-10 w-full" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Select City
            </Button>
            <Button variant="outline" className="flex items-center">
              Filters
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

        <div className="space-y-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
                  {store.verified && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{store.name}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {store.location}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 font-semibold">{store.rating}</span>
                        <span className="ml-1 text-gray-600">({store.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600">{store.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {store.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/stores/${store.id}`}>
                      <Button className="bg-green-500 hover:bg-green-600">Visit Store</Button>
                    </Link>
                  </div>
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
