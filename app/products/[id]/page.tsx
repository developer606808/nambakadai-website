"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, MapPin, Send, ThumbsUp, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"
import WishlistButton from "@/components/wishlist/wishlist-button"
import MetaTags from "@/components/seo/meta-tags"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      comment: "These apples look amazing! Are they still available? I'm interested in buying 5kg.",
      date: "2 days ago",
      likes: 5,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Great quality organic apples. I bought from this seller before and the produce was fresh and delicious.",
      date: "1 week ago",
      likes: 3,
    },
  ])
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  // Mock data for product details
  const product = {
    id: id,
    name: "Fresh Organic Apples",
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    price: 2.99,
    unit: "kg",
    rating: 5,
    reviews: 142,
    location: "Oakland, CA",
    quantity: "15 kg available",
    postedDate: "2024-01-15",
    seller: {
      id: "1",
      name: "Green Farms",
      image: "/placeholder.svg?height=50&width=50",
      verified: true,
      memberSince: "2022",
      totalAds: 45,
    },
    description:
      "Sweet and juicy apples grown organically in our farm. Harvested at the peak of ripeness for the best flavor. Perfect for eating fresh, making pies, or sauces. These are premium quality apples grown without harmful pesticides.",
    details:
      "These premium quality apples are grown without the use of harmful pesticides or chemical fertilizers. Our farming practices are sustainable and environmentally friendly. Each apple is hand-picked to ensure the highest quality. The apples are medium to large in size with a crisp texture and sweet flavor.",
    category: "Fruits",
    condition: "Fresh",
    related: [
      {
        id: 1,
        name: "Fresh Bananas",
        image: "/placeholder.svg?height=200&width=200",
        price: 1.5,
        location: "Chennai, Tamil Nadu",
        category: "Fruits",
      },
      {
        id: 2,
        name: "Organic Oranges",
        image: "/placeholder.svg?height=200&width=200",
        price: 3.2,
        location: "Ooty, Tamil Nadu",
        category: "Fruits",
      },
      {
        id: 3,
        name: "Fresh Strawberries",
        image: "/placeholder.svg?height=200&width=200",
        price: 5.99,
        location: "Kodaikanal, Tamil Nadu",
        category: "Fruits",
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
    <>
      <MetaTags
        title={product.name}
        description={`${product.description} - Posted by ${product.seller.name} in ${product.location}. Price: $${product.price}/${product.unit}`}
        keywords={`${product.name}, ${product.category}, organic produce, farm products, ${product.location}, classified ads`}
        type="product"
        image={product.images[0]}
        author={product.seller.name}
        publishedTime={product.postedDate}
      />
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative h-[400px] group">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-20">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted {product.postedDate}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="hover:bg-blue-50 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <WishlistButton productId={product.id} productName={product.name} variant="icon" />
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">{product.location}</span>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${product.price}/{product.unit}
                  </div>
                  <div className="text-sm text-gray-600">{product.quantity}</div>
                  <div className="text-sm text-gray-600">Condition: {product.condition}</div>
                </div>

                <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Image
                      src={product.seller.image || "/placeholder.svg"}
                      alt={product.seller.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">{product.seller.name}</span>
                        {product.seller.verified && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Member since {product.seller.memberSince} • {product.seller.totalAds} ads
                        </div>
                      </div>
                      <Button variant="link" className="text-green-600 hover:underline p-0 h-auto" asChild>
                        <Link href={`/stores/${product.seller.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Send a message to the seller..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                  <Button className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 transform hover:scale-105">
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description" className="bg-white rounded-lg border shadow-sm">
              <TabsList className="w-full justify-start p-6 bg-gray-50 rounded-t-lg">
                <TabsTrigger value="description" className="data-[state=active]:bg-white">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:bg-white">
                  Details
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-white">
                  Comments ({comments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
                <p className="text-gray-700 leading-relaxed">{product.details}</p>
              </TabsContent>

              <TabsContent value="specifications" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Category", value: product.category },
                    { label: "Condition", value: product.condition },
                    { label: "Location", value: product.location },
                    { label: "Quantity Available", value: product.quantity },
                    { label: "Posted Date", value: product.postedDate },
                    { label: "Seller", value: product.seller.name },
                  ].map((spec, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Comments & Questions</h2>

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
                              isAuthenticated ? "Ask a question or leave a comment..." : "Please log in to comment"
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
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <Image
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
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.related.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="inline-block bg-gray-100 rounded-md px-2 py-1 text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <div className="text-sm text-gray-600 mb-3">📍 {item.location}</div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-green-600">${item.price.toFixed(2)}</div>
                      <Button variant="outline" size="sm" className="hover:bg-green-50 transition-colors" asChild>
                        <Link href={`/products/${item.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}
