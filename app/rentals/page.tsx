import Link from "next/link"
import { Calendar, Filter, Grid3X3, List, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LazyImage } from "@/components/ui/lazy-image"

export const metadata = {
  title: "Equipment Rentals | Nanbakadai Farm Marketplace",
  description:
    "Rent farming equipment, tools, and machinery for your agricultural needs. Daily, weekly, and monthly rental options available.",
}

export default function RentalsPage() {
  // Mock rental categories
  const categories = [
    { id: "tractors", name: "Tractors", count: 24, icon: "🚜" },
    { id: "harvesters", name: "Harvesters", count: 16, icon: "🌾" },
    { id: "tools", name: "Hand Tools", count: 42, icon: "🔨" },
    { id: "irrigation", name: "Irrigation", count: 18, icon: "💧" },
    { id: "storage", name: "Storage", count: 9, icon: "🏢" },
    { id: "transport", name: "Transport", count: 15, icon: "🚚" },
    { id: "processing", name: "Processing", count: 11, icon: "⚙️" },
    { id: "land", name: "Land", count: 7, icon: "🌱" },
  ]

  // Mock rental items
  const rentalItems = [
    {
      id: 1,
      title: "John Deere 5075E Utility Tractor",
      category: "Tractors",
      price: 15000,
      period: "day",
      location: "Fukuoka, Japan",
      rating: 4.8,
      reviews: 24,
      image: "/placeholder.svg?height=300&width=400&text=John+Deere",
      available: true,
      featured: true,
    },
    {
      id: 2,
      title: "Kubota L3901 Compact Tractor",
      category: "Tractors",
      price: 12000,
      period: "day",
      location: "Tokyo, Japan",
      rating: 4.7,
      reviews: 18,
      image: "/placeholder.svg?height=300&width=400&text=Kubota",
      available: true,
      featured: false,
    },
    {
      id: 3,
      title: "Massey Ferguson 1840M",
      category: "Tractors",
      price: 14000,
      period: "day",
      location: "Osaka, Japan",
      rating: 4.6,
      reviews: 15,
      image: "/placeholder.svg?height=300&width=400&text=Massey",
      available: true,
      featured: false,
    },
    {
      id: 4,
      title: "New Holland Workmaster 75",
      category: "Tractors",
      price: 13500,
      period: "day",
      location: "Kyoto, Japan",
      rating: 4.5,
      reviews: 12,
      image: "/placeholder.svg?height=300&width=400&text=New+Holland",
      available: false,
      featured: false,
    },
    {
      id: 5,
      title: "Irrigation Pump System",
      category: "Irrigation",
      price: 5000,
      period: "day",
      location: "Sapporo, Japan",
      rating: 4.9,
      reviews: 32,
      image: "/placeholder.svg?height=300&width=400&text=Irrigation",
      available: true,
      featured: true,
    },
    {
      id: 6,
      title: "Grain Storage Silo (Small)",
      category: "Storage",
      price: 8000,
      period: "month",
      location: "Nagoya, Japan",
      rating: 4.4,
      reviews: 9,
      image: "/placeholder.svg?height=300&width=400&text=Storage",
      available: true,
      featured: false,
    },
    {
      id: 7,
      title: "Farm Truck - 2 Ton Capacity",
      category: "Transport",
      price: 9500,
      period: "day",
      location: "Yokohama, Japan",
      rating: 4.7,
      reviews: 21,
      image: "/placeholder.svg?height=300&width=400&text=Truck",
      available: true,
      featured: true,
    },
    {
      id: 8,
      title: "Professional Gardening Tool Set",
      category: "Tools",
      price: 2500,
      period: "week",
      location: "Kobe, Japan",
      rating: 4.8,
      reviews: 45,
      image: "/placeholder.svg?height=300&width=400&text=Tools",
      available: true,
      featured: false,
    },
  ]

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Rent Farming Equipment</h1>
              <p className="text-lg mb-8 opacity-90">
                Access high-quality farming equipment without the high costs of ownership. Daily, weekly, and monthly
                rental options available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-green-700 hover:bg-gray-100" size="lg" asChild>
                  <Link href="/rentals/list">List Your Equipment</Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-green-600" size="lg">
                  How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto py-8 px-4">
          <Breadcrumbs />

          {/* Categories */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Equipment Categories</h2>
              <Link href="/categories" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All Categories
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/rentals/category/${category.id}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured rentals */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Equipment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rentalItems
                .filter((item) => item.featured)
                .map((item) => (
                  <Link
                    href={`/rentals/${item.id}`}
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48">
                      <LazyImage src={item.image} alt={item.title} fill className="object-cover" />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <div className="flex items-baseline mb-2">
                        <span className="text-lg font-bold text-green-600">¥{item.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">/{item.period}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs ml-1">{item.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">({item.reviews})</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                      <Button className="w-full bg-green-500 hover:bg-green-600">View Details</Button>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* All rentals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">All Equipment</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <div className="border rounded-md flex">
                  <Button variant="ghost" size="sm" className="rounded-r-none border-r">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-l-none">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tractors">Tractors</TabsTrigger>
                <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentalItems.map((item) => (
                    <RentalCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tractors">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentalItems
                    .filter((item) => item.category === "Tractors")
                    .map((item) => (
                      <RentalCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="irrigation">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentalItems
                    .filter((item) => item.category === "Irrigation")
                    .map((item) => (
                      <RentalCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="tools">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentalItems
                    .filter((item) => item.category === "Tools")
                    .map((item) => (
                      <RentalCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="transport">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentalItems
                    .filter((item) => item.category === "Transport")
                    .map((item) => (
                      <RentalCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <Button variant="outline" className="px-8">
                Load More
              </Button>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-16 mb-10">
            <h2 className="text-2xl font-bold mb-8 text-center">How Renting Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Book Online</h3>
                <p className="text-gray-600">
                  Browse available equipment, select your dates, and book directly through our platform.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Confirm & Pay</h3>
                <p className="text-gray-600">
                  Receive confirmation from the owner, make secure payment, and arrange pickup or delivery.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Use & Return</h3>
                <p className="text-gray-600">
                  Use the equipment for your agreed rental period and return it in the same condition.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16">
            <div className="bg-green-50 border border-green-100 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Have Equipment to Rent Out?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Turn your idle equipment into income. List your farming equipment, tools, or machinery on our platform
                and start earning today.
              </p>
              <Button className="bg-green-500 hover:bg-green-600" size="lg" asChild>
                <Link href="/rentals/list">List Your Equipment</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

// Rental card component
function RentalCard({ item }: { item: any }) {
  return (
    <Link
      href={`/rentals/${item.id}`}
      className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative h-48">
        <LazyImage src={item.image} alt={item.title} fill className="object-cover" />
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.category}</span>
        </div>
        <h3 className="font-semibold mb-1">{item.title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">¥{item.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500 ml-1">/{item.period}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{item.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({item.reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {item.location}
        </div>
        <Button className="mt-auto w-full bg-green-500 hover:bg-green-600">View Details</Button>
      </div>
    </Link>
  )
}
