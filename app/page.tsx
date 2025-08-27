import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight, ChevronLeft, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/main-layout"

// Define types for our data
interface Product {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  seller: string
  sellerId: string
  isOrganic?: boolean
  isBestSeller?: boolean
  isRental?: boolean
}

interface Rental {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  availability: number
  category: string
}

interface Category {
  id: number
  name: string
  icon: string
  bgColor: string
  slug: string
}

interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  ctaText: string
  ctaLink: string
}

// Server-side data fetching functions
async function getFeaturedProducts(): Promise<Product[]> {
  // In a real app, this would fetch from your API/database
  // For now, we'll use a subset of the mock data
  return [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Organic Apples",
      price: 3.99,
      unit: "per pound",
      rating: 4.5,
      reviews: 128,
      location: "Oakland, CA",
      seller: "Green Valley Farms",
      sellerId: "1",
      isOrganic: true,
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=200",
      title: "Heirloom Tomatoes",
      price: 4.99,
      unit: "per lb",
      rating: 4.7,
      reviews: 86,
      location: "Berkeley, CA",
      seller: "Miller's Garden",
      sellerId: "2",
      isBestSeller: true,
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Strawberries",
      price: 5.99,
      unit: "per box",
      rating: 4.8,
      reviews: 152,
      location: "Santa Cruz, CA",
      seller: "Berry Farm",
      sellerId: "3",
      isOrganic: true,
      isBestSeller: true,
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Farm Eggs",
      price: 6.99,
      unit: "per dozen",
      rating: 4.9,
      reviews: 210,
      location: "Palo Alto, CA",
      seller: "Happy Hens Farm",
      sellerId: "4",
      isOrganic: true,
    },
  ]
}

async function getFeaturedRentals(): Promise<Rental[]> {
  // In a real app, this would fetch from your API/database
  return [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=200",
      title: "Farm Tractor - John Deere",
      price: 150,
      unit: "per day",
      rating: 4.5,
      reviews: 32,
      location: "San Jose, CA",
      availability: 12,
      category: "Heavy Equipment",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=200",
      title: "Pickup Truck - Ford F-150",
      price: 85,
      unit: "per day",
      rating: 4.7,
      reviews: 45,
      location: "Oakland, CA",
      availability: 20,
      category: "Trucks",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=200",
      title: "Delivery Van - Transit",
      price: 95,
      unit: "per day",
      rating: 4.6,
      reviews: 38,
      location: "San Francisco, CA",
      availability: 15,
      category: "Vans",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=200",
      title: "Compact Tractor - Kubota",
      price: 120,
      unit: "per day",
      rating: 4.8,
      reviews: 28,
      location: "Fremont, CA",
      availability: 8,
      category: "Heavy Equipment",
    },
  ]
}

async function getCategories(): Promise<Category[]> {
  // In a real app, this would fetch from your API/database
  return [
    { id: 1, name: "Fruits", icon: "🍎", bgColor: "bg-red-50", slug: "fruits" },
    { id: 2, name: "Vegetables", icon: "🥦", bgColor: "bg-green-50", slug: "vegetables" },
    { id: 3, name: "Organic Produce", icon: "🌱", bgColor: "bg-emerald-50", slug: "organic" },
    { id: 4, name: "Plants", icon: "🌾", bgColor: "bg-teal-50", slug: "plants" },
    { id: 5, name: "Milk", icon: "🍯", bgColor: "bg-yellow-50", slug: "dairy" },
    { id: 6, name: "Grains", icon: "🌽", bgColor: "bg-amber-50", slug: "grains" },
  ]
}

async function getBanners(): Promise<Banner[]> {
  // In a real app, this would fetch from your API/database
  return [
    {
      id: 1,
      title: "Fresh Seasonal Produce",
      subtitle: "Discover fruits and vegetables sourced from local farms",
      image: "/placeholder.svg?height=400&width=1200",
      ctaText: "Explore Now",
      ctaLink: "/seasonal",
    },
  ]
}

// Server component for the home page
export default async function Home() {
  // Fetch data server-side
  const [featuredProducts, featuredRentals, categories, banners] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedRentals(),
    getCategories(),
    getBanners(),
  ])

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f9fcf7] relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="bg-pattern"></div>
        </div>
        {/* Hero Section */}
        <section className="relative bg-[#f0f9ed] py-16 px-4 md:px-6 lg:px-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="leaf leaf-1"></div>
            <div className="leaf leaf-2"></div>
            <div className="leaf leaf-3"></div>
            <div className="leaf leaf-4"></div>
            <div className="leaf leaf-5"></div>
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Fresh From Farm <span className="text-black">to</span> <span className="text-green-600">Your Table</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect directly with local farmers, vendors, or sell your own products in our sustainable marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                Learn More
              </Button>
            </div>
            <div className="max-w-xl mx-auto relative">
              <Input
                className="pl-4 pr-12 py-2 rounded-md w-full"
                placeholder="Search for products, stores, or vendors..."
              />
              <Button className="absolute right-0 top-0 bottom-0 bg-green-500 hover:bg-green-600 rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Seasonal Produce Carousel */}
        <Suspense fallback={<BannerSkeleton />}>
          <BannerSection banners={banners} />
        </Suspense>

        {/* Browse Categories */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Browse Categories</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                icon={category.icon}
                label={category.name}
                bgColor={category.bgColor}
                category={category.slug}
              />
            ))}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Plus className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">View All</span>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm text-green-600 hover:underline flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Featured Rentals */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Featured Rentals</h2>
            <Link href="/rentals" className="text-sm text-green-600 hover:underline flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRentals.map((rental) => (
              <RentalCard key={rental.id} {...rental} />
            ))}
          </div>
        </section>

        {/* Sell on Platform */}
        <section className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-[#f0f9ed] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {/* Animated farm background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="farm-pattern"></div>
              <div className="floating-seed floating-seed-1"></div>
              <div className="floating-seed floating-seed-2"></div>
              <div className="floating-seed floating-seed-3"></div>
            </div>

            <div className="md:w-1/2 z-10">
              <h2 className="text-2xl font-bold mb-4">Start Selling on Nanbakadai</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of farmers and vendors who have found success in our marketplace. Our simple platform
                makes it easy to start selling today.
              </p>
              <Link href="/seller/register">
                <Button className="bg-green-500 hover:bg-green-600 flex items-center">
                  Create Your Store <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center z-10">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Selling on Nanbakadai"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Popular Stores */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Popular Stores</h2>
            <Link href="/stores" className="text-sm text-green-600 hover:underline flex items-center">
              View All Stores <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StoreCard
              id="1"
              image="/placeholder.svg?height=150&width=300"
              name="Green Valley Farm"
              category="Organic Produce"
              rating={4.8}
              reviews={67}
            />
            <StoreCard
              id="2"
              image="/placeholder.svg?height=150&width=300"
              name="Happy Hens"
              category="Poultry & Eggs"
              rating={4.7}
              reviews={43}
            />
            <StoreCard
              id="3"
              image="/placeholder.svg?height=150&width=300"
              name="Fresh Greens"
              category="Vegetables"
              rating={4.9}
              reviews={81}
            />
            <StoreCard
              id="4"
              image="/placeholder.svg?height=150&width=300"
              name="Berry Hill Farm"
              category="Fruits & Berries"
              rating={4.6}
              reviews={54}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="floating-particle floating-particle-1"></div>
            <div className="floating-particle floating-particle-2"></div>
            <div className="floating-particle floating-particle-3"></div>
            <div className="floating-particle floating-particle-4"></div>
            <div className="floating-particle floating-particle-5"></div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 relative z-10">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-8 relative z-10">
            Join thousands of satisfied customers who buy, sell, and rent on our platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Emily Johnson"
              role="Local Customer"
              quote="I love buying fresh produce directly from local farmers. The quality is amazing and I know exactly where my food comes from."
            />
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Michael Chang"
              role="Farm Owner"
              quote="Setting up my store on Nanbakadai was incredibly easy. Now I can sell directly to customers and avoid the middleman."
            />
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Sarah Wilson"
              role="Organic Gardener"
              quote="Being able to rent farming equipment when I need it has been a game changer for my small garden project."
            />
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

// Server component for banner section
async function BannerSection({ banners }: { banners: Banner[] }) {
  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 z-5">
          <div className="growing-plant growing-plant-1"></div>
          <div className="growing-plant growing-plant-2"></div>
          <div className="growing-plant growing-plant-3"></div>
        </div>
        {banners.length > 0 ? (
          <>
            <Image
              src={banners[0].image}
              alt={banners[0].title}
              width={1200}
              height={400}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-8 z-20">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{banners[0].title}</h2>
              <p className="text-white/90 mb-4">{banners[0].subtitle}</p>
              <Button className="bg-green-500 hover:bg-green-600 w-fit">
                <Link href={banners[0].ctaLink}>{banners[0].ctaText}</Link>
              </Button>
            </div>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30">
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Banner loading...</p>
          </div>
        )}
      </div>
    </section>
  )
}

// Skeleton for banner loading state
function BannerSkeleton() {
  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden h-[300px]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>
  )
}

// Component for category items
function CategoryItem({
  icon,
  label,
  bgColor,
  category,
}: { icon: string; label: string; bgColor: string; category: string }) {
  return (
    <Link href={`/categories/${category}`}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
          <span className="text-lg">{icon}</span>
        </div>
        <span className="text-xs text-center">{label}</span>
      </div>
    </Link>
  )
}

// Component for product cards
function ProductCard({
  id,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  seller,
  sellerId,
  isOrganic,
  isBestSeller,
  isRental,
}: {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  seller: string
  sellerId: string
  isOrganic?: boolean
  isBestSeller?: boolean
  isRental?: boolean
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {isOrganic && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Organic</div>
        )}
        {isBestSeller && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">Best Seller</div>
        )}
        {isRental && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Rental</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <div>📍 {location}</div>
          <div>
            Seller:{" "}
            <Link href={`/stores/${sellerId}`} className="text-green-600 hover:underline">
              {seller}
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
            <Link href={`/products/${id}`}>More Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50" asChild>
            <Link href={`/stores/${sellerId}`}>Visit Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component for store cards
function StoreCard({
  id,
  image,
  name,
  category,
  rating,
  reviews,
}: { id: string; image: string; name: string; category: string; rating: number; reviews: number }) {
  return (
    <Link href={`/stores/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-32">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{category}</p>
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs ml-1">{rating}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">({reviews} reviews)</span>
          </div>
          <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
            Visit Store
          </Button>
        </div>
      </div>
    </Link>
  )
}

// Component for vehicle rental cards
function RentalCard({
  id,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  availability,
  category,
}: {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  availability: number
  category: string
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Rental</div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          {availability} Available
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">{category}</p>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <div>📍 {location}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
            <Link href={`/rentals/${id}`}>View Details</Link>
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600" asChild>
            <Link href={`/rentals/${id}/request`}>Rent Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component for testimonial cards
function TestimonialCard({ avatar, name, role, quote }: { avatar: string; name: string; role: string; quote: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <Image src={avatar || "/placeholder.svg"} alt={name} width={40} height={40} className="rounded-full mr-3" />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 italic">"{quote}"</p>
    </div>
  )
}
