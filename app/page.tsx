import MainLayout from "@/components/main-layout"
import SeasonalTheme from "@/components/seasonal/seasonal-theme"
import NatureSounds from "@/components/audio/nature-sounds"
import VRStoreTour from "@/components/vr/vr-store-tour"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Truck, Shield, Users, TrendingUp, Eye } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <SeasonalTheme>
      <MainLayout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    🌱 Farm Fresh Marketplace
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    Fresh from Farm to Your{" "}
                    <span className="text-green-600 dark:text-green-400">Table</span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Connect directly with local farmers and discover the freshest organic produce, 
                    seasonal specialties, and sustainable farming practices in your area.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      Shop Fresh Produce
                    </Button>
                  </Link>
                  <Link href="/stores">
                    <Button variant="outline" size="lg" className="px-8 py-3">
                      Find Local Farms
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>500+ Farmers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>10k+ Products</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>100% Organic</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/organic-farm.png"
                    alt="Fresh organic vegetables from local farm"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🥬</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Fresh Today</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Harvested this morning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover fresh, seasonal produce and farm products organized by category
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Vegetables", icon: "🥕", count: "2,500+", href: "/categories/vegetables" },
                { name: "Fruits", icon: "🍎", count: "1,800+", href: "/categories/fruits" },
                { name: "Herbs", icon: "🌿", count: "450+", href: "/categories/herbs" },
                { name: "Grains", icon: "🌾", count: "320+", href: "/categories/grains" },
              ].map((category) => (
                <Link key={category.name} href={category.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.count} products
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Stores */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Farm Stores
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Visit our top-rated local farms and experience their unique offerings
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  id: "green-valley",
                  name: "Green Valley Organic Farm",
                  image: "/lush-vegetable-garden.png",
                  rating: 4.9,
                  reviews: 234,
                  location: "Fresno, CA",
                  specialties: ["Organic Vegetables", "Seasonal Fruits"],
                  deliveryTime: "Same day",
                  hasVRTour: true
                },
                {
                  id: "sunrise-orchards",
                  name: "Sunrise Fruit Orchards",
                  image: "/fruit-orchard.png",
                  rating: 4.8,
                  reviews: 189,
                  location: "Modesto, CA",
                  specialties: ["Stone Fruits", "Citrus"],
                  deliveryTime: "Next day",
                  hasVRTour: false
                },
                {
                  id: "heritage-grains",
                  name: "Heritage Grain Co.",
                  image: "/lush-rice-field.png",
                  rating: 4.7,
                  reviews: 156,
                  location: "Sacramento, CA",
                  specialties: ["Ancient Grains", "Flour"],
                  deliveryTime: "2-3 days",
                  hasVRTour: false
                }
              ].map((store) => (
                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <Image
                      src={store.image || "/placeholder.svg"}
                      alt={store.name}
                      width={400}
                      height={240}
                      className="object-cover w-full h-full"
                    />
                    {store.hasVRTour && (
                      <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">
                        <Eye className="h-3 w-3 mr-1" />
                        VR Tour
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {store.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span>{store.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{store.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({store.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {store.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Truck className="h-4 w-4 mr-1" />
                          <span>{store.deliveryTime}</span>
                        </div>
                        <Link href={`/stores/${store.id}`}>
                          <Button size="sm" variant="outline">
                            Visit Store
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Highlights */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What's in Season
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover the freshest seasonal produce available right now
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Winter Squash",
                  image: "/organic-farm-landscape.png",
                  season: "Peak Season",
                  price: "From $2.99/lb",
                  description: "Sweet, nutty butternut and acorn squash"
                },
                {
                  name: "Citrus Fruits",
                  image: "/fruit-orchard.png",
                  season: "In Season",
                  price: "From $1.99/lb",
                  description: "Juicy oranges, lemons, and grapefruits"
                },
                {
                  name: "Root Vegetables",
                  image: "/sustainable-farming.png",
                  season: "Available Now",
                  price: "From $1.49/lb",
                  description: "Fresh carrots, beets, and turnips"
                },
                {
                  name: "Leafy Greens",
                  image: "/lush-vegetable-garden.png",
                  season: "Year Round",
                  price: "From $2.49/bunch",
                  description: "Kale, spinach, and winter lettuce"
                }
              ].map((item) => (
                <Card key={item.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600">
                      {item.season}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {item.price}
                      </span>
                      <Button size="sm" variant="outline">
                        Shop Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-green-600 dark:bg-green-700">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Farm Fresh Journey?
              </h2>
              <p className="text-xl text-green-100 leading-relaxed">
                Join thousands of customers who trust us to deliver the freshest, 
                most sustainable produce directly from local farms to their tables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="px-8 py-3">
                    Create Account
                  </Button>
                </Link>
                <Link href="/seller/register">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-white border-white hover:bg-white hover:text-green-600">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Nature Sounds Component */}
        <NatureSounds />
      </MainLayout>
    </SeasonalTheme>
  )
}
