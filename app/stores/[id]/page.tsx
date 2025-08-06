"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Mail, Clock, ExternalLink, Star, Send, ThumbsUp, Users, Award, TrendingUp, Package, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import MainLayout from "@/components/main-layout"
import { useAuthRedux } from "@/hooks/use-auth-redux"
import { useToast } from "@/hooks/use-toast"
import { LazyImage } from "@/components/ui/lazy-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"
import { VRTourButton } from "@/components/vr/vr-store-tour"
import { SeasonalTheme } from "@/components/seasonal/seasonal-theme"
import { NatureSounds } from "@/components/audio/nature-sounds"
import Head from "next/head"

// SEO Component for Store Details
function StoreDetailsSEO({ store }: { store: any }) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nanbakadai.com"
  const url = `${baseUrl}${pathname}`

  // Structured data for local business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name: store.name,
    image: store.image,
    telephone: store.contact.phone,
    email: store.contact.email,
    url: store.contact.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: store.location,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.9716",
      longitude: "77.5946",
    },
    openingHours: store.contact.hours,
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: store.rating,
      reviewCount: store.reviews,
    },
  }

  return (
    <Head>
      <title>{`${store.name} | Nanbakadai Farm Marketplace`}</title>
      <meta name="description" content={store.description} />
      <meta name="keywords" content={`${store.tags.join(", ")}, farm products, organic, local produce`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="business.business" />
      <meta property="og:title" content={`${store.name} | Nanbakadai Farm Marketplace`} />
      <meta property="og:description" content={store.description} />
      <meta property="og:image" content={store.image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Nanbakadai" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${store.name} | Nanbakadai Farm Marketplace`} />
      <meta name="twitter:description" content={store.description} />
      <meta name="twitter:image" content={store.image} />

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <link rel="canonical" href={url} />
    </Head>
  )
}

export default function StoreDetailsPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Emily Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      comment: "Amazing store with fresh produce! The quality is consistently excellent and the staff is very helpful.",
      date: "3 days ago",
      likes: 8,
    },
    {
      id: 2,
      user: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      comment: "I've been shopping here for months. Best organic vegetables in the area. Highly recommended!",
      date: "1 week ago",
      likes: 12,
    },
  ])
  const { isAuthenticated, user } = useAuthRedux()
  const { toast } = useToast()

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

  // Mock data for store details
  const store = {
    id: params.id,
    name: "Green Valley Farm",
    image: "/placeholder.svg?height=400&width=800",
    coverImage: "/placeholder.svg?height=300&width=1200",
    description:
      "Sustainable farming practices with a wide range of organic products. We focus on environmentally friendly cultivation methods and offer fresh, seasonal produce directly from our farm to your table.",
    location: "Bangalore, Karnataka",
    rating: 4.6,
    reviews: 18,
    members: 1250,
    totalProducts: 45,
    totalSales: 2850,
    joinedDate: "2020",
    tags: ["Vegetables", "Organic"],
    verified: true,
    contact: {
      phone: "+91 98765 43210",
      email: "contact@greenvalleyfarm.com",
      website: "www.greenvalleyfarm.com",
      hours: "Mon-Sat: 8:00 AM - 6:00 PM",
    },
    products: [
      {
        id: 1,
        name: "Organic Tomatoes",
        image: "/placeholder.svg?height=200&width=200",
        price: 60,
        unit: "per kg",
        rating: 4.8,
        inStock: true,
        discount: 10
      },
      {
        id: 2,
        name: "Fresh Spinach",
        image: "/placeholder.svg?height=200&width=200",
        price: 40,
        unit: "per bunch",
        rating: 4.7,
        inStock: true,
        discount: 0
      },
      {
        id: 3,
        name: "Organic Carrots",
        image: "/placeholder.svg?height=200&width=200",
        price: 50,
        unit: "per kg",
        rating: 4.6,
        inStock: false,
        discount: 15
      },
      {
        id: 4,
        name: "Bell Peppers",
        image: "/placeholder.svg?height=200&width=200",
        price: 80,
        unit: "per kg",
        rating: 4.9,
        inStock: true,
        discount: 5
      },
      {
        id: 5,
        name: "Fresh Lettuce",
        image: "/placeholder.svg?height=200&width=200",
        price: 35,
        unit: "per head",
        rating: 4.5,
        inStock: true,
        discount: 0
      },
      {
        id: 6,
        name: "Organic Broccoli",
        image: "/placeholder.svg?height=200&width=200",
        price: 70,
        unit: "per kg",
        rating: 4.8,
        inStock: true,
        discount: 20
      },
    ],
  }

  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    const comment = {
      id: comments.length + 1,
      user: user?.name || "Anonymous",
      avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
      comment: newComment,
      date: "Just now",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
    toast({
      title: "Comment posted",
      description: "Your comment has been posted successfully",
    })
  }

  return (
    <SeasonalTheme>
      <MainLayout>
        <StoreDetailsSEO store={store} />
        <div className="min-h-screen relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Floating 3D Elements */}
            <div 
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-float-slow"
              style={{
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
              }}
            ></div>
            <div 
              className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 animate-float-medium"
              style={{
                transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px) rotateX(${mousePosition.y * -0.1}deg) rotateY(${mousePosition.x * -0.1}deg)`
              }}
            ></div>
          </div>

          <div className="container mx-auto py-8 px-4 relative z-10">
            <div className="mb-6">
              <Link href="/stores" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
                <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Stores
              </Link>
            </div>

            {/* 3D Store Header */}
            <div className="relative perspective-1000 mb-8">
              <div className="relative preserve-3d hover:rotate-x-2 transition-all duration-700">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  {/* Cover Image with 3D Effect */}
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <LazyImage
                      src={store.coverImage || "/placeholder.svg"}
                      alt={store.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                      {store.verified && (
                        <div className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Verified Store
                        </div>
                      )}
                      <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        Since {store.joinedDate}
                      </div>
                    </div>

                    {/* Store Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-end justify-between">
                        <div>
                          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{store.name}</h1>
                          <div className="flex items-center text-lg mb-2">
                            <MapPin className="h-5 w-5 mr-2" />
                            {store.location}
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${i < Math.floor(store.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/50"}`}
                                />
                              ))}
                              <span className="ml-2 font-semibold">{store.rating}</span>
                              <span className="ml-2 opacity-90">({store.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <VRTourButton storeId={store.id} />
                          <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300">
                            Follow Store
                          </Button>
                          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Stats Bar */}
                  <div className="bg-white/95 backdrop-blur-sm p-6 border-t border-white/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { icon: Users, label: "Members", value: store.members.toLocaleString(), color: "text-blue-600" },
                        { icon: Package, label: "Products", value: store.totalProducts.toString(), color: "text-green-600" },
                        { icon: TrendingUp, label: "Total Sales", value: store.totalSales.toLocaleString(), color: "text-purple-600" },
                        { icon: Star, label: "Rating", value: store.rating.toString(), color: "text-yellow-600" }
                      ].map((stat, index) => (
                        <div key={index} className="text-center group">
                          <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} bg-gray-100 rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">{store.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {store.tags.map((tag, index) => (
                        <span key={index} className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 3D Shadow */}
                <div className="absolute inset-0 bg-gray-400/20 rounded-3xl blur-sm transform translate-y-4 translate-x-2 -z-10"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="relative perspective-1000">
                  <div className="relative preserve-3d hover:rotate-x-1 transition-all duration-500">
                    <Tabs defaultValue="products" className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                      <TabsList className="w-full justify-start p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
                        <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-lg px-6 py-3 rounded-xl font-medium">
                          Products ({store.products.length})
                        </TabsTrigger>
                        <TabsTrigger value="comments" className="data-[state=active]:bg-white data-[state=active]:shadow-lg px-6 py-3 rounded-xl font-medium">
                          Reviews ({comments.length})
                        </TabsTrigger>
                        <TabsTrigger value="about" className="data-[state=active]:bg-white data-[state=active]:shadow-lg px-6 py-3 rounded-xl font-medium">
                          About
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="products" className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {store.products.map((product, index) => (
                            <LazyLoadWrapper key={product.id} delay={index * 100}>
                              <div className="group relative perspective-1000">
                                <div className="relative preserve-3d transition-all duration-500 hover:rotate-y-3 hover:scale-105">
                                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                                    {/* Product Image */}
                                    <div className="relative h-48 overflow-hidden">
                                      <LazyImage
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                      
                                      {/* Product Badges */}
                                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {!product.inStock && (
                                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Out of Stock
                                          </div>
                                        )}
                                        {product.discount > 0 && (
                                          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            {product.discount}% OFF
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                      <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                        {product.name}
                                      </h3>
                                      
                                      <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            />
                                          ))}
                                        </div>
                                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-baseline">
                                          <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                                          <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
                                        </div>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-all duration-300 transform hover:scale-105" 
                                          asChild
                                          disabled={!product.inStock}
                                        >
                                          <Link href={`/products/${product.id}`}>
                                            {product.inStock ? 'View Details' : 'Notify Me'}
                                          </Link>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* 3D Shadow */}
                                  <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-2 translate-x-1 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500"></div>
                                </div>
                              </div>
                            </LazyLoadWrapper>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Reviews</h2>

                            {/* Comment Form */}
                            <div className="relative perspective-1000 mb-8">
                              <div className="relative preserve-3d hover:rotate-x-1 transition-all duration-300">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-lg border border-white/20">
                                  <div className="flex space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user?.name?.charAt(0) || "?"}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <Textarea
                                        placeholder={
                                          isAuthenticated ? "Share your experience with this store..." : "Please log in to comment"
                                        }
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={!isAuthenticated}
                                        className="mb-4 bg-white/80 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-xl resize-none"
                                        rows={3}
                                      />
                                      <Button
                                        onClick={handleCommentSubmit}
                                        disabled={!isAuthenticated || !newComment.trim()}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Review
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                              {comments.map((comment, index) => (
                                <LazyLoadWrapper key={comment.id} delay={index * 100}>
                                  <div className="group relative perspective-1000">
                                    <div className="relative preserve-3d hover:rotate-x-1 transition-all duration-300">
                                      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start space-x-4">
                                          <LazyImage
                                            src={comment.avatar || "/placeholder.svg"}
                                            alt={comment.user}
                                            width={48}
                                            height={48}
                                            className="rounded-full shadow-lg"
                                          />
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                              <h4 className="font-bold text-gray-800">{comment.user}</h4>
                                              <span className="text-sm text-gray-500">{comment.date}</span>
                                            </div>
                                            <p className="text-gray-700 mb-4 leading-relaxed">{comment.comment}</p>
                                            <div className="flex items-center space-x-4">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-xl"
                                              >
                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                {comment.likes}
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-xl"
                                              >
                                                Reply
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* 3D Shadow */}
                                      <div className="absolute inset-0 bg-gray-400/10 rounded-2xl blur-sm transform translate-y-1 translate-x-0.5 -z-10 group-hover:translate-y-2 group-hover:translate-x-1 transition-transform duration-300"></div>
                                    </div>
                                  </div>
                                </LazyLoadWrapper>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="about" className="p-6">
                        <div className="space-y-8">
                          <div className="relative perspective-1000">
                            <div className="relative preserve-3d hover:rotate-x-1 transition-all duration-300">
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                                <h3 className="font-bold text-2xl mb-4 text-gray-800">Our Story</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed text-lg">{store.description}</p>
                                
                                <h3 className="font-bold text-xl mb-4 text-gray-800">Our Mission</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                  At Green Valley Farm, we are committed to sustainable agriculture and providing the freshest
                                  organic produce to our customers. We believe in farming practices that respect the environment and
                                  promote biodiversity.
                                </p>
                                
                                <h3 className="font-bold text-xl mb-4 text-gray-800">Our Practices</h3>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 text-lg">
                                  <li>No chemical pesticides or fertilizers</li>
                                  <li>Water conservation techniques</li>
                                  <li>Crop rotation to maintain soil health</li>
                                  <li>Support for local biodiversity</li>
                                  <li>Fair wages for all farm workers</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    {/* 3D Shadow */}
                    <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-3 translate-x-1.5 -z-10"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <LazyLoadWrapper>
                  <div className="relative perspective-1000">
                    <div className="relative preserve-3d hover:rotate-y-3 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <h3 className="font-bold text-xl mb-6 text-gray-800">Contact Information</h3>
                        <div className="space-y-4">
                          {[
                            { icon: Phone, label: "Phone", value: store.contact.phone, color: "text-blue-600" },
                            { icon: Mail, label: "Email", value: store.contact.email, color: "text-green-600" },
                            { icon: ExternalLink, label: "Website", value: store.contact.website, color: "text-purple-600" },
                            { icon: Clock, label: "Business Hours", value: store.contact.hours, color: "text-orange-600" },
                          ].map((contact, index) => (
                            <div key={index} className="flex items-start group">
                              <div className={`${contact.color} bg-gray-100 rounded-xl p-2 mr-4 group-hover:scale-110 transition-transform duration-300`}>
                                <contact.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">{contact.label}</p>
                                <p className="font-semibold text-gray-800">{contact.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 space-y-3">
                          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            Contact Seller
                          </Button>
                          <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-xl transform hover:scale-105 transition-all duration-300">
                            Follow Store
                          </Button>
                        </div>
                      </div>
                      
                      {/* 3D Shadow */}
                      <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-2 translate-x-1 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500"></div>
                    </div>
                  </div>
                </LazyLoadWrapper>

                {/* Location Map */}
                <LazyLoadWrapper delay={200}>
                  <div className="relative perspective-1000">
                    <div className="relative preserve-3d hover:rotate-y-3 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <h3 className="font-bold text-xl mb-4 text-gray-800">Location</h3>
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-emerald-200/50 animate-pulse"></div>
                          <div className="relative z-10 text-center">
                            <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <p className="text-green-700 font-medium">Interactive Map</p>
                            <p className="text-green-600 text-sm">Click to view directions</p>
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          {store.location}
                        </p>
                        <Button variant="outline" className="w-full mt-4 border-green-500 text-green-600 hover:bg-green-50 rounded-xl transform hover:scale-105 transition-all duration-300">
                          Get Directions
                        </Button>
                      </div>
                      
                      {/* 3D Shadow */}
                      <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-2 translate-x-1 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500"></div>
                    </div>
                  </div>
                </LazyLoadWrapper>

                {/* Store Stats */}
                <LazyLoadWrapper delay={400}>
                  <div className="relative perspective-1000">
                    <div className="relative preserve-3d hover:rotate-y-3 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <h3 className="font-bold text-xl mb-6 text-gray-800">Store Statistics</h3>
                        <div className="space-y-4">
                          {[
                            { label: "Total Products", value: store.totalProducts, icon: Package, color: "from-blue-400 to-cyan-500" },
                            { label: "Happy Customers", value: store.totalSales, icon: Users, color: "from-green-400 to-emerald-500" },
                            { label: "Store Members", value: store.members, icon: TrendingUp, color: "from-purple-400 to-pink-500" },
                          ].map((stat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                              <div className="flex items-center">
                                <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-2 mr-3`}>
                                  <stat.icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-700">{stat.label}</span>
                              </div>
                              <span className="font-bold text-gray-800">{stat.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 3D Shadow */}
                      <div className="absolute inset-0 bg-gray-400/20 rounded-2xl blur-sm transform translate-y-2 translate-x-1 -z-10 group-hover:translate-y-4 group-hover:translate-x-2 transition-transform duration-500"></div>
                    </div>
                  </div>
                </LazyLoadWrapper>
              </div>
            </div>
          </div>
        </div>

        {/* Nature Sounds Component */}
        <NatureSounds />
      </MainLayout>
    </SeasonalTheme>
  )
}
