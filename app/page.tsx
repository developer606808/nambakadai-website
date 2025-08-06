"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight, ChevronLeft, Plus, Star, MapPin, Users, TrendingUp, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"

export default function Home() {
  // Mock data for products (expand to 30+ items)
  const mockProducts = [
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
    {
      id: 5,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Carrots",
      price: 2.99,
      unit: "per bunch",
      rating: 4.6,
      reviews: 95,
      location: "San Jose, CA",
      seller: "Root Vegetables Co",
      sellerId: "5",
      isOrganic: true,
    },
    {
      id: 6,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Spinach",
      price: 3.49,
      unit: "per bag",
      rating: 4.4,
      reviews: 73,
      location: "Fremont, CA",
      seller: "Leafy Greens Farm",
      sellerId: "6",
      isOrganic: true,
    },
    {
      id: 7,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Broccoli",
      price: 4.29,
      unit: "per head",
      rating: 4.7,
      reviews: 112,
      location: "Sunnyvale, CA",
      seller: "Green Veggie Co",
      sellerId: "7",
      isOrganic: true,
    },
    {
      id: 8,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Corn",
      price: 1.99,
      unit: "per ear",
      rating: 4.5,
      reviews: 88,
      location: "Mountain View, CA",
      seller: "Corn Fields Farm",
      sellerId: "8",
    },
  ]

  // Mock data for rentals
  const mockRentals = [
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

  const [selectedType, setSelectedType] = useState<"products" | "rentals">("products")
  const [displayedProducts, setDisplayedProducts] = useState(mockProducts.slice(0, 8))
  const [displayedRentals, setDisplayedRentals] = useState(mockRentals.slice(0, 4))
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-slide for hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      image: "/placeholder.svg?height=400&width=1200&text=Fresh+Seasonal+Produce",
      title: "Fresh Seasonal Produce",
      subtitle: "Discover fruits and vegetables sourced from local farms",
      cta: "Explore Now"
    },
    {
      image: "/placeholder.svg?height=400&width=1200&text=Organic+Farming",
      title: "100% Organic Farming",
      subtitle: "Sustainable practices for healthier food and environment",
      cta: "Learn More"
    },
    {
      image: "/placeholder.svg?height=400&width=1200&text=Farm+Equipment",
      title: "Farm Equipment Rental",
      subtitle: "Rent professional farming equipment at affordable rates",
      cta: "Browse Equipment"
    }
  ]

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
            <div className="relative h-96 md:h-[500px] perspective-1000">
              <div className="relative w-full h-full preserve-3d">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform-gpu ${
                      index === currentSlide
                        ? 'translate-z-0 opacity-100 scale-100'
                        : index === (currentSlide + 1) % heroSlides.length
                        ? 'translate-z-[-200px] translate-x-full opacity-60 scale-90'
                        : 'translate-z-[-400px] translate-x-[-100%] opacity-30 scale-80'
                    }`}
                    style={{
                      transform: `
                        translateX(${index === currentSlide ? '0' : index > currentSlide ? '100%' : '-100%'})
                        translateZ(${index === currentSlide ? '0' : '-200px'})
                        rotateY(${index === currentSlide ? '0' : index > currentSlide ? '15deg' : '-15deg'})
                        scale(${index === currentSlide ? '1' : '0.9'})
                      `
                    }}
                  >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                        <p className="text-lg mb-6 opacity-90">{slide.subtitle}</p>
                        <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300">
                          {slide.cta}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 text-white shadow-lg transform hover:scale-110 transition-all duration-300 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 text-white shadow-lg transform hover:scale-110 transition-all duration-300 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {heroSlides.map((_, index) => (
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
          </div>
        </section>

        {/* 3D Stats Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, label: "Active Farmers", value: "10,000+", color: "from-green-400 to-emerald-500" },
                { icon: Award, label: "Quality Products", value: "50,000+", color: "from-blue-400 to-cyan-500" },
                { icon: MapPin, label: "Cities Covered", value: "100+", color: "from-purple-400 to-pink-500" },
                { icon: TrendingUp, label: "Happy Customers", value: "25,000+", color: "from-orange-400 to-red-500" }
              ].map((stat, index) => (
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
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3D Categories Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Browse Categories</h2>
            <p className="text-xl text-gray-600">Discover fresh produce and farming essentials</p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {[
              { icon: "🍎", label: "Fruits", bgColor: "from-red-400 to-pink-500", category: "fruits" },
              { icon: "🥦", label: "Vegetables", bgColor: "from-green-400 to-emerald-500", category: "vegetables" },
              { icon: "🌱", label: "Organic", bgColor: "from-emerald-400 to-teal-500", category: "organic" },
              { icon: "🌾", label: "Grains", bgColor: "from-yellow-400 to-orange-500", category: "grains" },
              { icon: "🥛", label: "Dairy", bgColor: "from-blue-400 to-cyan-500", category: "dairy" },
              { icon: "🍯", label: "Honey", bgColor: "from-amber-400 to-yellow-500", category: "honey" },
              { icon: "🌰", label: "Seeds", bgColor: "from-orange-400 to-red-500", category: "seeds" },
              { icon: "🚜", label: "Equipment", bgColor: "from-gray-400 to-slate-500", category: "equipment" }
            ].map((category, index) => (
              <CategoryCard3D key={index} {...category} index={index} />
            ))}
          </div>
        </section>

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {selectedType === "products"
              ? displayedProducts.map((product, index) => <ProductCard3D key={product.id} {...product} index={index} />)
              : displayedRentals.map((rental, index) => <RentalCard3D key={rental.id} {...rental} index={index} />)}
          </div>
        </section>

        {/* 3D Popular Stores */}
        <section className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Stores</h2>
            <p className="text-xl text-gray-600">Discover top-rated stores in your area</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: "1",
                image: "/placeholder.svg?height=200&width=300",
                name: "Green Valley Farm",
                category: "Organic Produce",
                rating: 4.8,
                reviews: 67,
                members: 1200,
                verified: true
              },
              {
                id: "2", 
                image: "/placeholder.svg?height=200&width=300",
                name: "Happy Hens",
                category: "Poultry & Eggs",
                rating: 4.7,
                reviews: 43,
                members: 890,
                verified: true
              },
              {
                id: "3",
                image: "/placeholder.svg?height=200&width=300", 
                name: "Fresh Greens",
                category: "Vegetables",
                rating: 4.9,
                reviews: 81,
                members: 1500,
                verified: false
              },
              {
                id: "4",
                image: "/placeholder.svg?height=200&width=300",
                name: "Berry Hill Farm", 
                category: "Fruits & Berries",
                rating: 4.6,
                reviews: 54,
                members: 750,
                verified: true
              }
            ].map((store, index) => (
              <StoreCard3D key={store.id} {...store} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

// 3D Category Card Component
function CategoryCard3D({ 
  icon, 
  label, 
  bgColor, 
  category, 
  index 
}: { 
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
          <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} rounded-2xl opacity-30 blur-sm transform translate-y-2 translate-x-1 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500`}></div>
        </div>
      </div>
    </Link>
  )
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
              <div>
                Seller: <Link href={`/stores/${sellerId}`} className="text-green-600 hover:underline font-medium">{seller}</Link>
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
  )
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
  )
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
  )
}
