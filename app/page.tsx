'use client'

import React, { Suspense, useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Star, Store as StoreIcon, Package, Truck, Eye, ShoppingCart, Sparkles, Users, Award, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import { CategoryCarousel } from "@/components/home/category-carousel"
import { CreateStoreBanner } from "@/components/home/create-store-banner"
import { ProductCard } from "@/components/home/product-card"
import { StoreCard } from "@/components/home/store-card"
import { RentalCard } from "@/components/home/rental-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ProductSkeleton, RentalSkeleton, StoreSkeleton } from "@/components/ui/skeletons"
import { useI18n } from "@/lib/i18n-context"



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


// Removed unused Category interface - using dynamic categories now



// Remove the old getCategories function - we'll use the dynamic one


// API Product interface
interface ApiProduct {
  id: number;
  title: string;
  slug?: string;
  publicKey?: string;
  image?: string;
  price: number;
  unit?: string | { symbol: string };
  location: string;
  seller?: string;
  sellerId?: string;
  sellerSlug?: string;
  sellerPublicKey?: string;
  isBestSeller?: boolean;
}

interface Rental {
  id: number;
  image: string;
  title: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  location: string;
  availability: number;
  category: string;
}

interface Store {
  id: number;
  name: string;
  slug?: string;
  publicKey?: string;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
}

// Transform for ProductCard component specifically
function transformForProductCard(apiProduct: ApiProduct): {
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

// Client Component - Main Home Page
export default function Home() {
  const { t } = useI18n();

  // State for dynamic data
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);
  const [featuredRentals, setFeaturedRentals] = useState<Rental[]>([]);
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [storeCategories, setStoreCategories] = useState<any[]>([]);

  // Fetch data on client side
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, rentalsRes, storesRes, categoriesRes] = await Promise.allSettled([
          fetch('/api/products/featured'),
          fetch('/api/rentals/featured'),
          fetch('/api/stores/featured'),
          fetch('/api/categories?type=STORE&limit=12')
        ]);

        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
          const products = await productsRes.value.json();
          setFeaturedProducts(products);
        }

        if (rentalsRes.status === 'fulfilled' && rentalsRes.value.ok) {
          const rentals = await rentalsRes.value.json();
          setFeaturedRentals(rentals);
        }

        if (storesRes.status === 'fulfilled' && storesRes.value.ok) {
          const stores = await storesRes.value.json();
          setFeaturedStores(stores);
        }

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
          const categories = await categoriesRes.value.json();
          setStoreCategories(categories.categories || []);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchData();
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full animate-float-slow blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/15 to-cyan-300/15 rounded-full animate-float-medium blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/10 to-green-300/10 rounded-full animate-float-fast blur-2xl"></div>
          <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full animate-float-slow blur-lg"></div>

          {/* Nature elements */}
          <div className="absolute top-16 left-1/3 text-green-300/30 text-6xl animate-sway">🌿</div>
          <div className="absolute bottom-16 right-16 text-green-400/25 text-5xl animate-sway-delayed">🌾</div>
          <div className="absolute top-2/3 left-16 text-emerald-300/20 text-4xl animate-float-medium">🌱</div>
          <div className="absolute bottom-1/3 right-1/4 text-teal-300/15 text-3xl animate-sway">🌸</div>
        </div>

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/8 rounded-full animate-float-fast"></div>
            <div className="absolute top-1/3 right-10 text-white/20 text-6xl animate-sway">🌾</div>
            <div className="absolute bottom-20 right-1/3 text-white/15 text-5xl animate-sway-delayed">🌱</div>
            <div className="absolute top-16 left-1/3 text-white/25 text-4xl animate-float-slow">🌿</div>
          </div>

          <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Fresh • Local • Direct Marketplace</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('home.title').split(' ')[0]} <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{t('home.title').split(' ').slice(1).join(' ')}</span>
                <br className="hidden sm:block" />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-normal text-green-100">{t('home.subtitle')}</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                {t('home.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button className="bg-white text-green-700 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg" size="lg" asChild>
                  <Link href="/products" className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t('common.search')}
                  </Link>
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm" size="lg" asChild>
                  <Link href="/seller/register" className="flex items-center gap-2">
                    <StoreIcon className="h-5 w-5" />
                    {t('nav.products')}
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">10K+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-80">Local Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">50K+</div>
                  <div className="text-sm opacity-80">Fresh Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">4.9★</div>
                  <div className="text-sm opacity-80">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-16 lg:h-20">
              <path fill="#f8fafc" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        <div className="container mx-auto py-8 px-4">
          {/* Create Store Banner - Enhanced */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-16 relative z-20">
            <CreateStoreBanner />
          </div>
        </div>

        {/* Dynamic Category Carousel */}
        <CategoryCarousel
          categories={storeCategories}
          title="Browse Categories"
          showViewAll={true}
        />

        {/* Enhanced Featured Products */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Package className="h-5 w-5" />
              {t('home.featuredProducts')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {t('home.featuredProductsDesc')}
            </p>
          </div>

          <ErrorBoundary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              <Suspense fallback={<ProductSkeleton />}>
                {transformedProducts.length > 0 ? (
                  transformedProducts.map((product, index) => (
                    <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                      <ProductCard {...product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                    <p className="text-gray-600 mb-6">We're working on adding amazing products for you!</p>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                      Check Back Soon
                    </Button>
                  </div>
                )}
              </Suspense>
            </div>
          </ErrorBoundary>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Enhanced Equipment Rental Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-12 lg:p-16 mx-4 sm:mx-6 lg:mx-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <Truck className="h-5 w-5" />
                {t('home.equipmentRental')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t('home.equipmentRental')}
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                {t('home.equipmentRentalDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
              <Suspense fallback={<RentalSkeleton />}>
                {featuredRentals.length > 0 ? (
                  featuredRentals.map((rental, index: number) => (
                    <div key={rental.id} className="animate-fade-in-up w-full max-w-sm" style={{animationDelay: `${index * 150}ms`}}>
                      <RentalCard {...rental} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Truck className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Equipment Coming Soon</h3>
                    <p className="text-gray-600 mb-6">We're adding farming equipment for rent!</p>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      Get Notified
                    </Button>
                  </div>
                )}
              </Suspense>
            </div>

            <div className="text-center mt-12">
              <Link href="/rentals">
                <Button variant="outline" className="group border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  View All Rentals
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Community Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                  <Users className="h-4 w-4" />
                  {t('home.joinCommunity')}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
                  {t('home.joinCommunity')}
                </h2>
                <p className="text-green-100 text-lg mb-8 leading-relaxed">
                  {t('home.joinCommunityDesc')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/seller/register">
                    <Button className="group bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <StoreIcon className="h-5 w-5 mr-3" />
                      {t('home.createStore')}
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="group border-2 border-white text-green-700 bg-white hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm">
                      <Eye className="h-5 w-5 mr-3" />
                      {t('home.browseProducts')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">10K+</div>
                    <div className="text-sm opacity-90">Active Sellers</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-sm opacity-90">Happy Customers</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">4.9★</div>
                    <div className="text-sm opacity-90">Average Rating</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stores Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Award className="h-5 w-5" />
              {t('trustedSellers')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('trustedSellers')}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {t('trustedSellersDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <Suspense fallback={<StoreSkeleton />}>
              {featuredStores.length > 0 ? (
                featuredStores.map((store, index: number) => (
                  <div key={store.id} className="animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                    <StoreCard
                      id={store.id}
                      slug={store.slug}
                      publicKey={store.publicKey}
                      image={store.image}
                      name={store.name}
                      category={store.category}
                      rating={store.rating}
                      reviews={store.reviews}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <StoreIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Stores Coming Soon</h3>
                  <p className="text-gray-600 mb-6">Amazing stores are joining our platform!</p>
                  <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    Browse Categories
                  </Button>
                </div>
              )}
            </Suspense>
          </div>

          <div className="text-center mt-12">
            <Link href="/stores">
              <Button variant="outline" className="group border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                View All Stores
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          {/* Enhanced background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full animate-float-slow blur-2xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-cyan-300/15 rounded-full animate-float-medium blur-xl"></div>
            <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-gradient-to-br from-teal-200/10 to-green-300/10 rounded-full animate-float-fast blur-3xl"></div>
            <div className="absolute top-1/3 right-10 text-green-300/20 text-7xl animate-sway">🌾</div>
            <div className="absolute bottom-20 right-1/3 text-emerald-400/15 text-6xl animate-sway-delayed">🌱</div>
          </div>

          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Star className="h-5 w-5 fill-current" />
              {t('customerStories')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              What Our Community Says
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers and farmers who trust Nambakadai for their fresh produce needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Emily Johnson"
              role="Local Customer"
              quote="I love buying fresh produce directly from local farmers. The quality is amazing and I know exactly where my food comes from."
              rating={5}
              delay={0}
            />
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Michael Chang"
              role="Farm Owner"
              quote="Setting up my store on Nambakadai was incredibly easy. Now I can sell directly to customers and avoid the middleman."
              rating={5}
              delay={200}
            />
            <TestimonialCard
              avatar="/placeholder.svg"
              name="Sarah Wilson"
              role="Organic Gardener"
              quote="Being able to rent farming equipment when I need it has been a game changer for my small garden project."
              rating={5}
              delay={400}
            />
          </div>

          {/* Enhanced CTA */}
          <div className="text-center mt-16 relative z-10">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-12 border border-green-100 shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-16 h-16 border border-green-400 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border border-emerald-400 rounded-full"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">{t('home.readyToJoin')}</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">{t('home.joinToday')}</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/signup">
                    <Button className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <Zap className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                      {t('home.getStarted')}
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/stores">
                    <Button variant="outline" className="group border-2 border-green-300 text-green-700 hover:bg-green-50 px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <Eye className="h-5 w-5 mr-3" />
                      {t('home.exploreStores')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}




// Enhanced Testimonial Card Component
function TestimonialCard({ avatar, name, role, quote, rating, delay = 0 }: {
  avatar: string;
  name: string;
  role: string;
  quote: string;
  rating?: number;
  delay?: number;
}) {
  return (
    <div
      className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
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
