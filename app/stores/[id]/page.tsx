import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Mail, Clock, ExternalLink, Star, Send, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"
import { useAuthRedux } from "@/hooks/use-auth-redux"
import { useToast } from "@/hooks/use-toast"
import { LazyImage } from "@/components/ui/lazy-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"
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

  // Mock data for store details
  const store = {
    id: params.id,
    name: "Green Valley Farm",
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Sustainable farming practices with a wide range of organic products. We focus on environmentally friendly cultivation methods and offer fresh, seasonal produce directly from our farm to your table.",
    location: "Bangalore, Karnataka",
    rating: 4.6,
    reviews: 18,
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
      },
      {
        id: 2,
        name: "Fresh Spinach",
        image: "/placeholder.svg?height=200&width=200",
        price: 40,
        unit: "per bunch",
        rating: 4.7,
      },
      {
        id: 3,
        name: "Organic Carrots",
        image: "/placeholder.svg?height=200&width=200",
        price: 50,
        unit: "per kg",
        rating: 4.6,
      },
      {
        id: 4,
        name: "Bell Peppers",
        image: "/placeholder.svg?height=200&width=200",
        price: 80,
        unit: "per kg",
        rating: 4.9,
      },
      {
        id: 5,
        name: "Fresh Lettuce",
        image: "/placeholder.svg?height=200&width=200",
        price: 35,
        unit: "per head",
        rating: 4.5,
      },
      {
        id: 6,
        name: "Organic Broccoli",
        image: "/placeholder.svg?height=200&width=200",
        price: 70,
        unit: "per kg",
        rating: 4.8,
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
    <MainLayout>
      <StoreDetailsSEO store={store} />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/stores" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Stores
          </Link>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden mb-8 shadow-lg">
          <div className="relative h-64 md:h-80">
            <LazyImage
              src={store.image || "/placeholder.svg"}
              alt={store.name}
              fill
              className="object-cover"
              priority
            />
            {store.verified && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Verified
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {store.location}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(store.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-1 font-semibold">{store.rating}</span>
                  <span className="ml-1 text-gray-600">({store.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{store.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {store.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="products" className="bg-white rounded-lg border shadow-sm">
              <TabsList className="w-full justify-start p-6 bg-gray-50 rounded-t-lg">
                <TabsTrigger value="products" className="data-[state=active]:bg-white">
                  Products
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-white">
                  Comments ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-white">
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {store.products.map((product, index) => (
                    <LazyLoadWrapper key={product.id} delay={index * 100}>
                      <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-48 relative">
                          <LazyImage
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{product.name}</h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-sm">{product.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-green-600">
                              ₹{product.price} <span className="text-xs text-gray-500">{product.unit}</span>
                            </div>
                            <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors" asChild>
                              <Link href={`/products/${product.id}`}>More Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </LazyLoadWrapper>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Store Reviews</h2>

                    {/* Comment Form */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
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
                            className="mb-3 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                          />
                          <Button
                            onClick={handleCommentSubmit}
                            disabled={!isAuthenticated || !newComment.trim()}
                            className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Post Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment, index) => (
                        <LazyLoadWrapper key={comment.id} delay={index * 100}>
                          <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start space-x-3">
                              <LazyImage
                                src={comment.avatar || "/placeholder.svg"}
                                alt={comment.user}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{comment.user}</h4>
                                  <span className="text-sm text-gray-500">{comment.date}</span>
                                </div>
                                <p className="text-gray-700 mb-3">{comment.comment}</p>
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    {comment.likes}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </LazyLoadWrapper>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about" className="p-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 mb-6 leading-relaxed">{store.description}</p>
                    <h3 className="font-semibold text-lg mb-4">Our Mission</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      At Green Valley Farm, we are committed to sustainable agriculture and providing the freshest
                      organic produce to our customers. We believe in farming practices that respect the environment and
                      promote biodiversity.
                    </p>
                    <h3 className="font-semibold text-lg mb-4">Our Practices</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>No chemical pesticides or fertilizers</li>
                      <li>Water conservation techniques</li>
                      <li>Crop rotation to maintain soil health</li>
                      <li>Support for local biodiversity</li>
                      <li>Fair wages for all farm workers</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <LazyLoadWrapper>
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: "Phone", value: store.contact.phone },
                    { icon: Mail, label: "Email", value: store.contact.email },
                    { icon: ExternalLink, label: "Website", value: store.contact.website },
                    { icon: Clock, label: "Business Hours", value: store.contact.hours },
                  ].map((contact, index) => (
                    <div key={index} className="flex items-start">
                      <contact.icon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{contact.label}</p>
                        <p className="font-medium">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 transform hover:scale-105">
                    Contact Seller
                  </Button>
                </div>
              </div>
            </LazyLoadWrapper>

            <LazyLoadWrapper delay={200}>
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <p className="text-gray-500">Map placeholder</p>
                </div>
                <p className="text-gray-600">{store.location}</p>
              </div>
            </LazyLoadWrapper>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
