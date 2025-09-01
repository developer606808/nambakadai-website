'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import { BannerSection } from "@/components/home/banner-section"
import { CategoryCarousel } from "@/components/home/category-carousel"
import { CreateStoreBanner } from "@/components/home/create-store-banner"
import { useWishlist } from "@/hooks/useWishlist"
import { useSession } from "next-auth/react"

// Define types for our data
interface Product {
  id: number
  title: string
  slug: string
  publicKey: string
  images: string[]
  price: number
  unit: {
    symbol: string
  }
  location: string
  store: {
    id: number
    name: string
  }
  isFeatured: boolean
  wishlistCount: number
  createdAt: string
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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/featured`, {
      cache: 'no-store', // Ensure fresh data
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

async function getFeaturedRentals(): Promise<Rental[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/rentals/featured`, {
      cache: 'no-store', // Ensure fresh data
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

async function getFeaturedStores(): Promise<any[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/featured`, {
      cache: 'no-store', // Ensure fresh data
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

// Remove the old getCategories function - we'll use the dynamic one

export default function Home() {
  const { data: session } = useSession();
  const { wishlistStatus, toggleWishlist, checkWishlistStatus } = useWishlist();

  // State for server data
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredRentals, setFeaturedRentals] = useState<Rental[]>([]);
  const [featuredStores, setFeaturedStores] = useState<any[]>([]);
  const [storeCategories, setStoreCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data client-side
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, rentalsRes, storesRes, categoriesRes] = await Promise.all([
          fetch('/api/products/featured'),
          fetch('/api/rentals/featured'),
          fetch('/api/stores/featured'),
          fetch('/api/categories?type=STORE&limit=12'),
        ]);

        const products = productsRes.ok ? await productsRes.json() : [];
        const rentals = rentalsRes.ok ? await rentalsRes.json() : [];
        const stores = storesRes.ok ? await storesRes.json() : [];
        const categoriesResponse = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
        const categories = categoriesResponse.categories || [];

        setFeaturedProducts(products);
        setFeaturedRentals(rentals);
        setFeaturedStores(stores);
        setStoreCategories(categories);

        // Check wishlist status for products
        if (session?.user && products.length > 0) {
          const productIds = products.map((p: any) => p.id);
          await checkWishlistStatus(productIds);
        }

        // Check wishlist status for rentals (assuming rentals have product-like structure)
        if (session?.user && rentals.length > 0) {
          const rentalIds = rentals.map((r: any) => r.id);
          await checkWishlistStatus(rentalIds);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user, checkWishlistStatus]);

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
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onWishlistToggle={toggleWishlist}
                  isInWishlist={wishlistStatus[product.id]}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new products!</p>
              </div>
            )}
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
            {featuredRentals.length > 0 ? (
              featuredRentals.map((rental) => (
                <RentalCard
                  key={rental.id}
                  {...rental}
                  onWishlistToggle={toggleWishlist}
                  isInWishlist={wishlistStatus[rental.id]}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No featured rentals available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new rental options!</p>
              </div>
            )}
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
            {featuredStores.length > 0 ? (
              featuredStores.map((store) => (
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
  title,
  slug,
  publicKey,
  images,
  price,
  unit,
  location,
  store,
  isFeatured,
  onWishlistToggle,
  isInWishlist,
}: {
  id: number
  title: string
  slug: string
  publicKey: string
  images: string[]
  price: number
  unit: {
    symbol: string
  }
  location: string
  store: {
    id: number
    name: string
  }
  isFeatured: boolean
  onWishlistToggle?: (productId: number) => void
  isInWishlist?: boolean
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative">
        <Image
          src={images[0] || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-40 sm:h-48 object-cover"
        />
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">Featured</div>
        )}
        {/* Wish Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(id);
          }}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
        </button>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold mb-1 text-sm sm:text-base line-clamp-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-base sm:text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">/{unit.symbol}</span>
        </div>
        <div className="text-xs text-gray-500 mb-3 flex-1">
          <div className="truncate">📍 {location}</div>
          <div className="truncate">
            Store:{" "}
            <Link href={`/stores/${store.id}`} className="text-green-600 hover:underline">
              {store.name}
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs" asChild>
            <Link href={`/products/${slug}/${publicKey}`}>Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50 text-xs" asChild>
            <Link href={`/stores/${store.id}`}>Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component for store cards
function StoreCard({
  id,
  slug,
  publicKey,
  image,
  name,
  category,
  rating,
  reviews,
}: { id: string; slug?: string; publicKey?: string; image: string; name: string; category: string; rating: number; reviews: number }) {
  const storeUrl = slug && publicKey ? `/stores/${slug}/${publicKey}` : `/stores/${id}`;

  return (
    <Link href={storeUrl}>
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
  slug,
  publicKey,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  availability,
  category,
  onWishlistToggle,
  isInWishlist,
}: {
  id: number
  slug?: string
  publicKey?: string
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  availability: number
  category: string
  onWishlistToggle?: (productId: number) => void
  isInWishlist?: boolean
}) {
  const rentalUrl = slug && publicKey ? `/rentals/${slug}/${publicKey}` : `/rentals/${id}`;
  const rentalRequestUrl = slug && publicKey ? `/rentals/${slug}/${publicKey}/request` : `/rentals/${id}/request`;

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
        {/* Wish Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(id);
          }}
          className="absolute top-12 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
        </button>
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
            <Link href={rentalUrl}>View Details</Link>
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600" asChild>
            <Link href={rentalRequestUrl}>Rent Now</Link>
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
