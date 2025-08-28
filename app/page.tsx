import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import { BannerSection } from "@/components/home/banner-section"
import { CategoryCarousel } from "@/components/home/category-carousel"
import { CreateStoreBanner } from "@/components/home/create-store-banner"
import { getActiveCategories } from "@/lib/services/categoryService"

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

// Removed unused Category interface - using dynamic categories now



// Server-side data fetching functions
async function getFeaturedProducts(): Promise<Product[]> {
  // In a real app, this would fetch from your API/database
  // For now, we'll use a subset of the mock data
  return [
    {
      id: 1,
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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

// Remove the old getCategories function - we'll use the dynamic one



// Server component for the home page
export default async function Home() {
  // Fetch data server-side
  const [featuredProducts, featuredRentals, storeCategories] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedRentals(),
    getActiveCategories('STORE', 12),
  ])

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f9fcf7] relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="bg-pattern"></div>
        </div>

        {/* Dynamic Banner Section - Now the main hero */}
        <BannerSection />

        {/* Create Store Banner - Show only for logged in users without stores */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <CreateStoreBanner />
        </div>

        {/* Dynamic Category Carousel */}
        <CategoryCarousel
          categories={storeCategories}
          title="Browse Categories"
          showViewAll={true}
        />

        {/* Featured Products */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm text-green-600 hover:underline flex items-center self-start sm:self-auto">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Featured Rentals */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Featured Rentals</h2>
            <Link href="/rentals" className="text-sm text-green-600 hover:underline flex items-center self-start sm:self-auto">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredRentals.map((rental) => (
              <RentalCard key={rental.id} {...rental} />
            ))}
          </div>
        </section>

        {/* Sell on Platform */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#f0f9ed] rounded-lg p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
            {/* Animated farm background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="farm-pattern"></div>
              <div className="floating-seed floating-seed-1"></div>
              <div className="floating-seed floating-seed-2"></div>
              <div className="floating-seed floating-seed-3"></div>
            </div>

            <div className="lg:w-1/2 z-10 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Start Selling on Nanbakadai</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Join thousands of farmers and vendors who have found success in our marketplace. Our simple platform
                makes it easy to start selling today.
              </p>
              <Link href="/seller/register">
                <Button className="bg-green-500 hover:bg-green-600 flex items-center w-full sm:w-auto justify-center">
                  Create Your Store <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center z-10">
              <Image
                src="/placeholder.svg"
                alt="Selling on Nanbakadai"
                width={400}
                height={300}
                className="rounded-lg w-full max-w-sm lg:max-w-none"
              />
            </div>
          </div>
        </section>

        {/* Popular Stores */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Popular Stores</h2>
            <Link href="/stores" className="text-sm text-green-600 hover:underline flex items-center self-start sm:self-auto">
              View All Stores <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <StoreCard
              id="1"
              image="/placeholder.svg"
              name="Green Valley Farm"
              category="Organic Produce"
              rating={4.8}
              reviews={67}
            />
            <StoreCard
              id="2"
              image="/placeholder.svg"
              name="Happy Hens"
              category="Poultry & Eggs"
              rating={4.7}
              reviews={43}
            />
            <StoreCard
              id="3"
              image="/placeholder.svg"
              name="Fresh Greens"
              category="Vegetables"
              rating={4.9}
              reviews={81}
            />
            <StoreCard
              id="4"
              image="/placeholder.svg"
              name="Berry Hill Farm"
              category="Fruits & Berries"
              rating={4.6}
              reviews={54}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="floating-particle floating-particle-1"></div>
            <div className="floating-particle floating-particle-2"></div>
            <div className="floating-particle floating-particle-3"></div>
            <div className="floating-particle floating-particle-4"></div>
            <div className="floating-particle floating-particle-5"></div>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2 relative z-10">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-8 relative z-10 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of satisfied customers who buy, sell, and rent on our platform.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Emily Johnson"
              role="Local Customer"
              quote="I love buying fresh produce directly from local farmers. The quality is amazing and I know exactly where my food comes from."
            />
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Michael Chang"
              role="Farm Owner"
              quote="Setting up my store on Nanbakadai was incredibly easy. Now I can sell directly to customers and avoid the middleman."
            />
            <TestimonialCard
              avatar="/placeholder.svg"
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



// Removed old CategoryItem component - using dynamic CategoryCarousel now

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
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-40 sm:h-48 object-cover"
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
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold mb-1 text-sm sm:text-base line-clamp-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-base sm:text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3 flex-1">
          <div className="truncate">📍 {location}</div>
          <div className="truncate">
            Seller:{" "}
            <Link href={`/stores/${sellerId}`} className="text-green-600 hover:underline">
              {seller}
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs" asChild>
            <Link href={`/products/${id}`}>Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50 text-xs" asChild>
            <Link href={`/stores/${sellerId}`}>Store</Link>
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
