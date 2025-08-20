"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight, ChevronLeft, Plus, Star, MapPin, Users, TrendingUp, Award, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"
import ServerCategoryData from '@/components/server-category-data'; // Import the new Server Component

// Interfaces for API data
interface StatItem {
  label: string;
  value: string;
  icon: string; // Icon name as string from API
  color: string;
}

interface ProductItem {
  id: number;
  image: string;
  title: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  location: string;
  seller: string;
  sellerId: string;
  isOrganic?: boolean;
  isBestSeller?: boolean;
}

interface RentalItem {
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

interface StoreItem {
  id: string;
  image: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  members: number;
  verified: boolean;
}

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

// Helper to map icon names to Lucide components
const getLucideIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users': return Users;
    case 'Award': return Award;
    case 'MapPin': return MapPin;
    case 'TrendingUp': return TrendingUp;
    default: return Info; // Fallback
  }
};

export default function Home() {
  const [selectedType, setSelectedType] = useState<"products" | "rentals">("products");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // State for API data
  const [stats, setStats] = useState<StatItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [featuredRentals, setFeaturedRentals] = useState<RentalItem[]>([]);
  const [popularStores, setPopularStores] = useState<StoreItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const [storesLoading, setStoresLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);

  const [statsError, setStatsError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [rentalsError, setRentalsError] = useState<string | null>(null);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [bannersError, setBannersError] = useState<string | null>(null);

  const [categories, setCategories] = useState<StatItem[]>([]);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();

    const getCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
        const categories: any = await res.json();
        setCategories(categories);
      } catch (err: any) {
        // setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
      
    }
    getCategories()
  }, []);

  // Fetch Featured Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/featured`);
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (err: any) {
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Featured Rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rentals/featured`);
        if (!res.ok) throw new Error('Failed to fetch featured rentals');
        const data = await res.json();
        setFeaturedRentals(data);
      } catch (err: any) {
        setRentalsError(err.message);
      } finally {
        setRentalsLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // Fetch Popular Stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stores/popular`);
        if (!res.ok) throw new Error('Failed to fetch popular stores');
        const data = await res.json();
        setPopularStores(data);
      } catch (err: any) {
        setStoresError(err.message);
      } finally {
        setStoresLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/banners?isActive=true&limit=10`);
        if (!res.ok) throw new Error('Failed to fetch banners');
        const { data } = await res.json();
        setBanners(data);
      } catch (err: any) {
        setBannersError(err.message);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-slide for hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-transparent to-blue-100/20"></div>
          {/* Floating 3D Elements */}
          <div 
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-float-slow"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-float-medium"
            style={{
              transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px) rotateX(${mousePosition.y * -0.1}deg) rotateY(${mousePosition.x * -0.1}deg)`
            }}
          ></div>
          <div 
            className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-float-fast"
            style={{
              transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * 0.04}px) rotateX(${mousePosition.y * 0.15}deg) rotateY(${mousePosition.x * 0.15}deg)`
            }}
          ></div>
          {/* 3D Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid-3d"></div>
          </div>
        </div>
        {/* Hero Section with 3D Carousel */}
        <section className="relative py-20 px-4 md:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-16 relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient-x">
                Fresh From Farm
                <span className="block text-gray-800">to Your Table</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect directly with local farmers, vendors, or sell your own products in our sustainable marketplace.
              </p>
              {/* 3D Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button variant="outline" className="group relative border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Learn More</span>
                </Button>
              </div>
              {/* 3D Search Bar */}
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                  <div className="flex">
                    <Input
                      className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0 focus:outline-none px-6 py-4"
                      placeholder="Search for products, stores, or vendors..."
                    />
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* 3D Hero Carousel */}
            {bannersLoading ? (
              <div className="text-center text-gray-500">Loading banners...</div>
            ) : bannersError ? (
              <div className="text-center text-red-500">Error loading banners: {bannersError}</div>
            ) : banners.length === 0 ? (
              <div className="text-center text-gray-500">No active banners found.</div>
            ) : (
              <div className="relative h-96 md:h-[500px] perspective-1000">
                <div className="relative w-full h-full preserve-3d">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out transform-gpu ${
                        index === currentSlide
                          ? 'translate-z-0 opacity-100 scale-100'
                          : index === (currentSlide + 1) % banners.length
                          ? 'translate-z-[-200px] translate-x-full opacity-60 scale-90'
                          : 'translate-z-[-400px] translate-x-[-100%] opacity-30 scale-80'
                      }`}
                      style={{
                        transform: `                        translateX(${index === currentSlide ? '0' : index > currentSlide ? '100%' : '-100%'})                        translateZ(${index === currentSlide ? '0' : '-200px'})                        rotateY(${index === currentSlide ? '0' : index > currentSlide ? '15deg' : '-15deg'})                        scale(${index === currentSlide ? '1' : '0.9'})                      `
                      }}
                    >
                      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={banner.imageUrl || "/placeholder.svg"}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">{banner.title}</h2>
                          <p className="text-lg mb-6 opacity-90">{banner.linkUrl}</p>
                          {banner.linkUrl && (
                            <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300" asChild>
                              <Link href={banner.linkUrl}>Learn More</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Carousel Controls */}
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 text-white shadow-lg transform hover:scale-110 transition-all duration-300 z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 text-white shadow-lg transform hover:scale-110 transition-all duration-300 z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        {/* 3D Stats Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            {statsLoading ? (
              <div className="text-center text-gray-500">Loading stats...</div>
            ) : statsError ? (
              <div className="text-center text-red-500">Error loading stats: {statsError}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const IconComponent = getLucideIcon(stat.icon); // Get the actual icon component
                  return (
                    <div
                      key={index}
                      className="group relative"
                      style={{
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border border-white/20">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                        <div className="relative z-10 text-center">
                          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl mb-4 shadow-lg`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                          <div className="text-gray-600 font-medium">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        {/* 3D Categories Section */}
        <ServerCategoryData categories={categories} /> {/* Render the ServerCategoryData component here */}
        {/* 3D Featured Products */}
        <section className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Featured Items</h2>
              <p className="text-xl text-gray-600">Handpicked quality products from trusted farmers</p>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "products" | "rentals")}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 text-lg shadow-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="products">Store Products</option>
              <option value="rentals">Rental Vehicles</option>
            </select>
          </div>
          {productsLoading || rentalsLoading ? (
            <div className="text-center text-gray-500">Loading featured items...</div>
          ) : productsError || rentalsError ? (
            <div className="text-center text-red-500">Error loading featured items: {productsError || rentalsError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {selectedType === "products"
                ? featuredProducts.map((product, index) => <ProductCard3D key={product.id} {...product} index={index} />)
                : featuredRentals.map((rental, index) => <RentalCard3D key={rental.id} {...rental} index={index} />)}
            </div>
          )}
        </section>
        {/* 3D Popular Stores */}
        <section className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Stores</h2>
            <p className="text-xl text-gray-600">Discover top-rated stores in your area</p>
          </div>
          {storesLoading ? (
            <div className="text-center text-gray-500">Loading popular stores...</div>
          ) : storesError ? (
            <div className="text-center text-red-500">Error loading popular stores: {storesError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularStores.map((store, index) => (
                <StoreCard3D key={store.id} {...store} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

// 3D Category Card Component
function CategoryCard3D({
  icon,
  label,
  bgColor,
  category,
  index }: {
  icon: string
  label: string
  bgColor: string
  category: string
  index: number
}) {
  return (
    <Link href={`/categories/${category}`}>
      <div 
        className="group relative perspective-1000"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative preserve-3d transition-all duration-500 hover:rotate-y-12 hover:scale-110">
          <div className={`relative bg-gradient-to-br ${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transform transition-all duration-500 border border-white/20`}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                {icon}
              </div>
              <span className="text-white font-semibold text-sm">{label}</span>
            </div>
          </div>
          {/* 3D Shadow */}
          <div className={`absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-3 translate-x-2 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500`}></div>
        </div>
      </div>
    </Link>
  );
}

// 3D Product Card Component
function ProductCard3D({
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
  index
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
  index: number
}) {
  return (
    <div 
      className="group relative perspective-1000"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative preserve-3d transition-all duration-700 hover:rotate-y-6 hover:scale-105">
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isOrganic && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                  Organic
                </div>
              )}
              {isBestSeller && (
                <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                  Best Seller
                </div>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-bold text-green-600">${price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-1">{unit}</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm ml-2 font-medium">{rating}</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">({reviews})</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center mb-1">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-gray-300 hover:border-green-500 hover:text-green-600 transition-all duration-300" 
                asChild
              >
                <Link href={`/products/${id}`}>Details</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-300" 
                asChild
              >
                <Link href={`/stores/${sellerId}`}>Visit Store</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* 3D Shadow */}
        <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-3 translate-x-2 -z-10 group-hover:translate-y-6 group-hover:translate-x-4 transition-transform duration-700"></div>
      </div>
    </div>
  );
}

// 3D Rental Card Component  
function RentalCard3D({
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
  index
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
  index: number
}) {
  return (
    <div 
      className="group relative perspective-1000"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative preserve-3d transition-all duration-700 hover:rotate-y-6 hover:scale-105">
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Badges */}
            <div className="absolute top-3 left-3">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                Rental
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                {availability} Available
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-lg mb-1 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{category}</p>
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-1">{unit}</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm ml-2 font-medium">{rating}</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">({reviews})</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300" 
                asChild
              >
                <Link href={`/rentals/${id}`}>View Details</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-all duration-300" 
                asChild
              >
                <Link href={`/rentals/${id}/request`}>Rent Now</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* 3D Shadow */}
        <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-3 translate-x-2 -z-10 group-hover:translate-y-6 group-hover:translate-x-4 transition-transform duration-700"></div>
      </div>
    </div>
  );
}

// 3D Store Card Component
function StoreCard3D({
  id,
  image,
  name,
  category,
  rating,
  reviews,
  members,
  verified,
  index
}: {
  id: string
  image: string
  name: string
  category: string
  rating: number
  reviews: number
  members: number
  verified: boolean
  index: number
}) {
  return (
    <Link href={`/stores/${id}`}>
      <div 
        className="group relative perspective-1000"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative preserve-3d transition-all duration-700 hover:rotate-y-6 hover:scale-105">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20">
            {/* Image Container */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              {verified && (
                <div className="absolute top-3 right-3">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                {name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{category}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm ml-2 font-medium">{rating}</span>
                </div>
                <span className="text-sm text-gray-500">({reviews})</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {members.toLocaleString()} members
                </div>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-300">
                Visit Store
              </Button>
            </div>
          </div>
          {/* 3D Shadow */}
          <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-3 translate-x-2 -z-10 group-hover:translate-y-6 group-hover:translate-x-4 transition-transform duration-700"></div>
        </div>
      </div>
    </Link>
  );
}