import React, { Suspense } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Heart, QrCode, Share2, MapPin, Store as StoreIcon, Package, Truck, Eye, ShoppingCart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import { BannerSection } from "@/components/home/banner-section"
import { CategoryCarousel } from "@/components/home/category-carousel"
import { CreateStoreBanner } from "@/components/home/create-store-banner"
import { ProductCard } from "@/components/home/product-card"
import { StoreCard } from "@/components/home/store-card"
import { RentalCard } from "@/components/home/rental-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ProductSkeleton, RentalSkeleton, StoreSkeleton } from "@/components/ui/skeletons"

// Server-side data fetching functions
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/featured`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch featured products');
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getFeaturedRentals() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/rentals/featured`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch featured rentals');
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured rentals:', error);
    return [];
  }
}

async function getFeaturedStores() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/featured`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch featured stores');
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured stores:', error);
    return [];
  }
}

async function getStoreCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?type=STORE&limit=12`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour for categories
    });

    if (!response.ok) {
      console.error('Failed to fetch categories');
      return { categories: [] };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [] };
  }
}

// Define types for our data
interface Product {
  id: number
  title: string
  slug?: string
  publicKey?: string
  images?: string[]
  price: number
  unit?: string | { symbol: string }
  location: string
  store?: {
    id: number
    name: string
  }
  seller?: string
  sellerId?: string
  isFeatured?: boolean
  wishlistCount?: number
  createdAt?: string
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



// Remove the old getCategories function - we'll use the dynamic one

// Transform API data to match component expectations
function transformProductData(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    slug: apiProduct.slug || `product-${apiProduct.id}`,
    publicKey: apiProduct.publicKey || `key-${apiProduct.id}`,
    images: apiProduct.image ? [apiProduct.image] : ["/placeholder.svg"],
    price: apiProduct.price,
    unit: typeof apiProduct.unit === 'string'
      ? { symbol: apiProduct.unit }
      : apiProduct.unit || { symbol: 'unit' },
    location: apiProduct.location,
    store: apiProduct.seller && apiProduct.sellerId
      ? {
          id: parseInt(apiProduct.sellerId),
          name: apiProduct.seller
        }
      : undefined,
    isFeatured: apiProduct.isBestSeller || false,
  };
}

// Transform for ProductCard component specifically
function transformForProductCard(apiProduct: any): {
  id: number;
  title: string;
  slug?: string;
  publicKey?: string;
  images?: string[];
  price: number;
  unit: { symbol: string };
  location: string;
  store?: { id: number; name: string; slug?: string; publicKey?: string };
  isFeatured?: boolean;
} {
  // Ensure unit is always an object with symbol property
  let unit: { symbol: string } = { symbol: 'unit' };
  if (apiProduct.unit) {
    if (typeof apiProduct.unit === 'string') {
      unit = { symbol: apiProduct.unit };
    } else if (apiProduct.unit && apiProduct.unit.symbol) {
      unit = { symbol: apiProduct.unit.symbol };
    }
  }

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    slug: apiProduct.slug || `product-${apiProduct.id}`,
    publicKey: apiProduct.publicKey || `key-${apiProduct.id}`,
    images: apiProduct.image ? [apiProduct.image] : ["/placeholder.svg"],
    price: apiProduct.price,
    unit: unit,
    location: apiProduct.location,
    store: apiProduct.seller && apiProduct.sellerId
      ? {
          id: parseInt(apiProduct.sellerId),
          name: apiProduct.seller,
          slug: apiProduct.sellerSlug,
          publicKey: apiProduct.sellerPublicKey
        }
      : undefined,
    isFeatured: apiProduct.isBestSeller || false,
  };
}

// Server Component - Main Home Page
export default async function Home() {
  // Fetch data with better error handling and caching
  let featuredProducts = [];
  let featuredRentals = [];
  let featuredStores = [];
  let storeCategories = [];

  try {
    // Use Promise.allSettled for better error handling
    const results = await Promise.allSettled([
      getFeaturedProducts(),
      getFeaturedRentals(),
      getFeaturedStores(),
      getStoreCategories(),
    ]);

    // Extract successful results
    if (results[0].status === 'fulfilled') {
      featuredProducts = results[0].value;
    }
    if (results[1].status === 'fulfilled') {
      featuredRentals = results[1].value;
    }
    if (results[2].status === 'fulfilled') {
      featuredStores = results[2].value;
    }
    if (results[3].status === 'fulfilled') {
      storeCategories = results[3].value.categories || [];
    }
  } catch (error) {
    console.error('Error fetching home page data:', error);
    // Continue with empty arrays if all fail
  }

  // Transform product data to match component expectations
  const transformedProducts: Array<{
    id: number;
    title: string;
    slug?: string;
    publicKey?: string;
    images?: string[];
    price: number;
    unit: { symbol: string };
    location: string;
    store?: { id: number; name: string; slug?: string; publicKey?: string };
    isFeatured?: boolean;
  }> = featuredProducts.map(transformForProductCard);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
        {/* Simplified Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Reduced floating elements for better performance */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-green-200/10 rounded-full"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-emerald-300/8 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-teal-200/6 rounded-full"></div>

          {/* Simplified leaf patterns */}
          <div className="absolute top-16 left-1/3 text-green-300/20 text-4xl">🌿</div>
          <div className="absolute bottom-16 right-16 text-green-400/20 text-3xl">🌾</div>
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

        {/* Enhanced Featured Products */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Package className="h-4 w-4" />
                Fresh Products
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Discover the finest agricultural products from local farmers</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ErrorBoundary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <Suspense fallback={<ProductSkeleton />}>
                {transformedProducts.length > 0 ? (
                  transformedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...(product as any)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
                    <p className="text-gray-400 text-sm mt-2">Check back later for new products!</p>
                  </div>
                )}
              </Suspense>
            </div>
          </ErrorBoundary>
        </section>

        {/* Enhanced Featured Rentals */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Truck className="h-4 w-4" />
                Equipment Rental
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Featured Rentals
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Rent farming equipment and tools from trusted providers</p>
            </div>
            <Link href="/rentals" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Rentals
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Suspense fallback={<RentalSkeleton />}>
              {featuredRentals.length > 0 ? (
                featuredRentals.map((rental: any) => (
                  <RentalCard
                    key={rental.id}
                    {...rental}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No featured rentals available at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for new rental options!</p>
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Compact Sell on Platform */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 shadow-lg relative overflow-hidden">
            {/* Subtle animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 bg-green-200/10 rounded-full animate-float-slow"></div>
              <div className="absolute bottom-4 left-4 text-green-300/15 text-2xl animate-sway">🌱</div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 relative z-10">
              <div className="lg:w-2/3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <StoreIcon className="h-4 w-4" />
                  Join Our Community
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Start Selling on Nambakadai
                </h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Join thousands of farmers and vendors who have found success in our marketplace. Start selling today and connect with local customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/seller/register">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-2.5 text-sm font-semibold">
                      <StoreIcon className="h-4 w-4 mr-2" />
                      Create Store
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-6 py-2.5 text-sm font-semibold">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg text-center">
                    <div className="text-lg font-bold">10K+</div>
                    <div className="text-xs opacity-90">Happy Sellers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Popular Stores */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100/80 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <StoreIcon className="h-4 w-4" />
                Trusted Sellers
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Popular Stores
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Discover amazing stores from verified farmers and vendors</p>
            </div>
            <Link href="/stores" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Stores
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Suspense fallback={<StoreSkeleton />}>
              {featuredStores.length > 0 ? (
                featuredStores.map((store: any) => (
                  <StoreCard
                    key={store.id}
                    id={store.id}
                    slug={store.slug}
                    publicKey={store.publicKey}
                    image={store.image}
                    name={store.name}
                    category={store.category}
                    rating={store.rating}
                    reviews={store.reviews}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No featured stores available at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for new stores!</p>
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
          {/* Animated nature background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/10 rounded-full animate-float-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/8 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/6 rounded-full animate-float-fast"></div>
            <div className="absolute top-1/3 right-10 text-green-300/15 text-5xl animate-sway">🌾</div>
            <div className="absolute bottom-20 right-1/3 text-emerald-400/12 text-4xl animate-sway-delayed">🌱</div>
          </div>

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 fill-current" />
              Customer Stories
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who buy, sell, and rent on our platform.
              Real stories from real people building their agricultural dreams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Emily Johnson"
              role="Local Customer"
              quote="I love buying fresh produce directly from local farmers. The quality is amazing and I know exactly where my food comes from."
              rating={5}
            />
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Michael Chang"
              role="Farm Owner"
              quote="Setting up my store on Nanbakadai was incredibly easy. Now I can sell directly to customers and avoid the middleman."
              rating={5}
            />
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Sarah Wilson"
              role="Organic Gardener"
              quote="Being able to rent farming equipment when I need it has been a game changer for my small garden project."
              rating={5}
            />
          </div>

          {/* Call to action */}
          <div className="text-center mt-12 relative z-10">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Join Our Community?</h3>
              <p className="text-gray-600 mb-6">Start your journey with Nambakadai today</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3">
                    Get Started
                  </Button>
                </Link>
                <Link href="/stores">
                  <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-8 py-3">
                    Explore Stores
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}




// Enhanced Testimonial Card Component
function TestimonialCard({ avatar, name, role, quote, rating }: {
  avatar: string;
  name: string;
  role: string;
  quote: string;
  rating?: number;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-green-300/30 text-2xl group-hover:text-green-400/50 transition-colors">"</div>

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="relative">
            <Image
              src={avatar || "/placeholder.svg"}
              alt={name}
              width={48}
              height={48}
              className="rounded-full border-2 border-green-100 group-hover:border-green-300 transition-colors"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-1 rounded-full">
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
            {rating && (
              <div className="flex items-center mt-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 italic leading-relaxed group-hover:text-gray-700 transition-colors">
          "{quote}"
        </p>

        {/* Decorative element */}
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}
