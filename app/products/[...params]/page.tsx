"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, MapPin, Send, ThumbsUp, Calendar, User, Tag, Heart, MessageCircle, Store, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MainLayout } from "@/components/main-layout"
import WishlistButton from "@/components/wishlist/wishlist-button"
import MetaTags from "@/components/seo/meta-tags"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useWishlist } from "@/hooks/useWishlist"

// Utility function to validate image URLs
const getValidImageUrl = (url: string | undefined | null): string => {
  if (!url) return "/placeholder.svg"
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url
  }
  return "/placeholder.svg"
}

interface Product {
  id: number
  title: string
  slug: string
  description: string
  price: number
  images: string[]
  stock: number
  adId: string
  publicKey: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  category: {
    id: number
    name_en: string
    name_ta?: string
    slug: string
  }
  store: {
    id: number
    name: string
    logo?: string
    slug: string
    publicKey: string
  }
  unit: {
    id: number
    name_en: string
    symbol: string
  }
}

interface ProductComment {
  id: number
  content: string
  createdAt: string
  likeCount: number
  user: {
    id: number
    name: string
    avatar?: string
  }
  likes: Array<{ userId: number }>
  replies?: ProductComment[]
}

export default function ProductDetailsPage({
  params
}: {
  params: Promise<{ params: string[] }>
}) {
  // Unwrap the params Promise using React.use()
  const { params: routeParams } = use(params)

  // Extract slug and publicKey from the params array
  const [slug, publicKey] = routeParams || []

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<ProductComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [messageText, setMessageText] = useState("")
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)
  const [productRating, setProductRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)

  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const { wishlistStatus, toggleWishlist } = useWishlist()

  useEffect(() => {
    if (slug && publicKey) {
      fetchProduct()
      fetchComments()
    }
  }, [slug, publicKey])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${publicKey}`)

      if (!response.ok) {
        throw new Error('Product not found')
      }

      const productData = await response.json()
      setProduct(productData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/products/${publicKey}/comments`)
      if (response.ok) {
        const commentsData = await response.json()
        setComments(commentsData)
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  const handleCommentSubmit = async () => {
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

    try {
      setCommentsLoading(true)
      const response = await fetch(`/api/products/${publicKey}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments([newCommentData, ...comments])
        setNewComment("")
        toast({
          title: "Comment posted",
          description: "Your comment has been posted successfully",
        })
      } else {
        throw new Error('Failed to post comment')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like comments",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/products/${publicKey}/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        // Update the comment's like count in the local state
        setComments(comments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                likeCount: result.liked ? comment.likeCount + 1 : comment.likeCount - 1,
                likes: result.liked
                  ? [...comment.likes, { userId: parseInt(user?.id || '0') }]
                  : comment.likes.filter(like => like.userId !== parseInt(user?.id || '0'))
              }
            : comment
        ))
      }
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages",
        variant: "destructive",
      })
      return
    }

    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    try {
      setMessageLoading(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: product?.store.publicKey,
          content: messageText.trim(),
          messageType: 'text',
          metadata: {
            source: 'product_details_page',
            productId: product?.id,
            productName: product?.title,
            storeName: product?.store.name
          }
        }),
      })

      if (response.ok) {
        setMessageText("")
        toast({
          title: "Message sent",
          description: "Your message has been sent to the seller",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setMessageLoading(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard",
      })
    }).catch(() => {
      toast({
        title: "Share",
        description: url,
      })
    })
  }

  const fetchRelatedProducts = async () => {
    if (!product) return

    try {
      setRelatedLoading(true)
      const response = await fetch(`/api/products?category=${product.category.id}&limit=10&exclude=${product.id}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error)
    } finally {
      setRelatedLoading(false)
    }
  }

  const handleRatingSubmit = async () => {
    if (!isAuthenticated || !product || userRating < 1 || userRating > 5) {
      toast({
        title: "Invalid Rating",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmittingRating(true)
      const response = await fetch(`/api/products/${publicKey}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: userRating,
          comment: userComment.trim() || null
        }),
      })

      if (response.ok) {
        const newRating = await response.json()
        setUserRating(0)
        setUserComment("")
        toast({
          title: "Rating submitted!",
          description: "Thank you for your feedback",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit rating')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit rating",
        variant: "destructive",
      })
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
              <Link href="/products">
                <Button>Back to Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <>
      <MetaTags
        title={product.title}
        description={`${product.description} - Posted by ${product.user.name}. Price: $${product.price}/${product.unit.symbol}`}
        keywords={`${product.title}, ${product.category.name_en}, farm products, classified ads`}
        type="product"
        image={product.images[0] && product.images[0].startsWith('http') ? product.images[0] : undefined}
        author={product.user.name}
        publishedTime={product.createdAt}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Main Product Image */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                <div className="relative h-[500px] group overflow-hidden rounded-xl">
                  <Image
                    src={getValidImageUrl(product.images[0])}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-xl border border-gray-200 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="relative h-20 rounded-lg overflow-hidden">
                      <Image
                        src={getValidImageUrl(image)}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Product Header */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-green-500" />
                        Posted {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-blue-500" />
                        Ad ID: {product.adId}
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1 text-purple-500" />
                        {product.stock} in stock
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    {isAuthenticated && (
                      <WishlistButton productId={product.id.toString()} productName={product.title} variant="icon" />
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-1">
                        ₹{product.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {product.unit.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {product.stock} Available
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ✓ In Stock
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Image
                    src={getValidImageUrl(product.store.logo)}
                    alt={product.store.name}
                    width={60}
                    height={60}
                    className="rounded-lg border-2 border-white shadow-md"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="font-bold text-xl text-gray-900">{product.store.name}</span>
                      <span className="ml-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                        Verified Store
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Seller: {product.user.name}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button variant="link" className="text-green-600 hover:underline p-0 h-auto font-medium" asChild>
                        <Link href={`/stores/${product.store.slug || 'store'}/${product.store.publicKey || product.store.id}`}>View Store Details →</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Send a message to the seller..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 transform hover:scale-105"
                    onClick={handleSendMessage}
                    disabled={messageLoading || !messageText.trim()}
                  >
                    {messageLoading ? "Sending..." : "Contact Seller"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Want to Contact the Seller?</h3>
                    <p className="text-gray-600 mb-4">Please log in to send messages to sellers and get in touch about this product.</p>
                    <Link href="/login">
                      <Button className="bg-green-500 hover:bg-green-600">
                        Log In to Contact Seller
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                <Link href={`/categories/${product.category.slug}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    View All
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </Link>
              </div>

              {relatedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : relatedProducts.length > 0 ? (
                <div className="relative">
                  {/* Left fade */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

                  {/* Scrollable content */}
                  <div className="flex space-x-6 overflow-x-auto pb-6 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors">
                    {relatedProducts.map((relatedProduct: any) => (
                      <div key={relatedProduct.id} className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getValidImageUrl(relatedProduct.images[0])}
                            alt={relatedProduct.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleWishlist(relatedProduct.id);
                                }}
                                className="w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                              >
                                <Heart className={`w-4 h-4 ${wishlistStatus[relatedProduct.id] ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                          {/* Store Info */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Image
                                src={getValidImageUrl(relatedProduct.store.logo)}
                                alt={relatedProduct.store.name}
                                width={16}
                                height={16}
                                className="rounded-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-600 truncate">
                                {relatedProduct.store.name}
                              </p>
                            </div>
                          </div>

                          {/* Product Title */}
                          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                            {relatedProduct.title}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="text-lg font-bold text-green-600">
                                ₹{relatedProduct.price}
                              </div>
                              <div className="text-xs text-gray-500">
                                per {relatedProduct.unit.symbol}
                              </div>
                            </div>
                            <Link href={`/products/${relatedProduct.slug}/${relatedProduct.publicKey}`}>
                              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                View
                              </Button>
                            </Link>
                          </div>

                          {/* Stock Info */}
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-500">
                              <Package className="w-3 h-3 mr-1" />
                              <span>{relatedProduct.stock} in stock</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right fade */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No related products found</h3>
                  <p className="text-gray-500">Check out more products in this category.</p>
                </div>
              )}
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
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </TabsContent>

              <TabsContent value="specifications" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Category",
                      value: product.category.name_en,
                      icon: <Tag className="h-4 w-4" />,
                      color: "bg-green-100 text-green-800 border-green-200"
                    },
                    {
                      label: "Store",
                      value: product.store.name,
                      icon: <Store className="h-4 w-4" />,
                      color: "bg-blue-100 text-blue-800 border-blue-200"
                    },
                    {
                      label: "Unit",
                      value: product.unit.name_en,
                      icon: <Package className="h-4 w-4" />,
                      color: "bg-purple-100 text-purple-800 border-purple-200"
                    },
                    {
                      label: "Stock Available",
                      value: `${product.stock} available`,
                      icon: <span className="text-lg">📦</span>,
                      color: "bg-orange-100 text-orange-800 border-orange-200"
                    },
                    {
                      label: "Posted Date",
                      value: new Date(product.createdAt).toLocaleDateString(),
                      icon: <Calendar className="h-4 w-4" />,
                      color: "bg-gray-100 text-gray-800 border-gray-200"
                    },
                    {
                      label: "Ad ID",
                      value: product.adId,
                      icon: <span className="text-lg">🏷️</span>,
                      color: "bg-indigo-100 text-indigo-800 border-indigo-200"
                    },
                  ].map((spec, index) => (
                    <div key={index} className={`p-4 border rounded-xl hover:shadow-md transition-all duration-200 ${spec.color}`}>
                      <div className="flex items-center mb-2">
                        <div className="mr-3 text-gray-600">
                          {spec.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-600">{spec.label}</p>
                      </div>
                      <p className="font-semibold text-lg">{spec.value}</p>
                    </div>
                  ))}
                </div>

                {/* Additional Category Navigation */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-green-600" />
                    Browse Similar Products
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/categories/${product.category.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      More in {product.category.name_en}
                    </Link>
                    <Link
                      href={`/stores/${product.store.slug || 'store'}/${product.store.publicKey || product.store.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      More from {product.store.name}
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      All Products
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-6">
                <div className="space-y-8">
                  {/* Product Rating Overview */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(productRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-lg">{productRating.toFixed(1)}</span>
                        <span className="text-gray-600">({totalRatings} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Submission Form */}
                  {isAuthenticated && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-2" />
                        Write a Review
                      </h3>

                      {/* Star Rating */}
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Your Rating</Label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setUserRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= userRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {userRating > 0 && `${userRating} star${userRating > 1 ? 's' : ''}`}
                        </p>
                      </div>

                      {/* Comment */}
                      <div className="mb-4">
                        <Label htmlFor="rating-comment" className="text-sm font-medium text-gray-700 mb-2 block">
                          Your Review (Optional)
                        </Label>
                        <Textarea
                          id="rating-comment"
                          placeholder="Share your experience with this product..."
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          rows={4}
                          className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={handleRatingSubmit}
                          disabled={submittingRating || userRating < 1}
                          className="bg-green-500 hover:bg-green-600 transition-colors duration-200 transform hover:scale-105"
                        >
                          {submittingRating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Comments Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                      Comments & Questions ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    {isAuthenticated ? (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6">
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user?.name?.charAt(0) || "?"}
                            </div>
                          </div>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Ask a question or leave a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="mb-4 transition-all duration-200 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                Your comment will be visible to other users
                              </p>
                              <Button
                                onClick={handleCommentSubmit}
                                disabled={commentsLoading || !newComment.trim()}
                                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                              >
                                {commentsLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Posting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 mb-6">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Conversation</h3>
                          <p className="text-gray-600 mb-4">Log in to leave comments, ask questions, and share your experience with this product.</p>
                          <Link href="/login">
                            <Button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Log In to Comment
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                          >
                            <div className="flex items-start space-x-4">
                              <Image
                                src={getValidImageUrl(comment.user.avatar)}
                                alt={comment.user.name}
                                width={48}
                                height={48}
                                className="rounded-full ring-2 ring-gray-100"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Verified User
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-4 leading-relaxed">{comment.content}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    {isAuthenticated ? (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                          onClick={() => handleLikeComment(comment.id)}
                                        >
                                          <ThumbsUp className={`h-4 w-4 mr-1 ${comment.likes.some(like => like.userId === parseInt(user?.id || '0')) ? 'fill-current text-red-500' : ''}`} />
                                          {comment.likeCount}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                        >
                                          <MessageCircle className="h-4 w-4 mr-1" />
                                          Reply
                                        </Button>
                                      </>
                                    ) : (
                                      <div className="text-sm text-gray-500 flex items-center">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {comment.likeCount} {comment.likeCount === 1 ? 'like' : 'likes'}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Helpful?
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No comments yet</h3>
                          <p className="text-gray-500">Be the first to leave a comment or ask a question about this product.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </>
  )
}