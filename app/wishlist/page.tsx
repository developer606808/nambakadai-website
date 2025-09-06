'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import { useWishlist } from "@/hooks/useWishlist"

interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product: {
    id: number;
    publicKey: string;
    slug: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    if (session?.user) {
      refreshWishlist().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session?.user, refreshWishlist]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Items Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Skeleton */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex justify-center">
                <div className="h-10 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">Items you've saved for later</p>
          </div>

        {!session?.user ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 sm:p-12 text-center shadow-xl animate-fade-in">
            <div className="mb-6">
              <Heart className="h-20 w-20 text-red-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Please Sign In
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">You need to be logged in to view your wishlist</p>
            </div>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Heart className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 sm:p-12 text-center shadow-xl animate-fade-in">
            <div className="mb-6">
              <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Save items you like for future reference</p>
            </div>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sm:p-8 shadow-xl animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {wishlistItems.length} Items in Wishlist
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">Keep track of items you love</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={clearingAll}
                  onClick={async () => {
                    if (!session?.user || wishlistItems.length === 0) return;

                    setClearingAll(true);
                    try {
                      // Clear all wishlist items
                      const deletePromises = wishlistItems.map(item =>
                        fetch('/api/wishlist/status', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            productId: item.productId,
                            action: 'remove'
                          }),
                        })
                      );

                      await Promise.all(deletePromises);
                      await refreshWishlist();
                    } catch (error) {
                      console.error('Error clearing wishlist:', error);
                    } finally {
                      setClearingAll(false);
                    }
                  }}
                  className="w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 rounded-full px-6 py-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {clearingAll ? 'Clearing...' : 'Clear All'}
                </Button>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {wishlistItems.map((item: WishlistItem, index) => (
                <div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold bg-red-500/90 px-4 py-2 rounded-full text-sm shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* Wishlist Heart */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </div>
                    {/* Remove Button Overlay */}
                    <button
                      onClick={async () => {
                        try {
                          await removeFromWishlist(item.productId);
                          await refreshWishlist();
                        } catch (error) {
                          console.error('Error removing item from wishlist:', error);
                        }
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors text-sm sm:text-base">
                      {item.product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        ₹{item.product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600 font-medium">
                          {item.product.stock > 10 ? 'In Stock' : item.product.stock > 0 ? `Only ${item.product.stock} left` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/products/${item.product.slug}/${item.product.publicKey}`} className="flex-1">
                        <Button
                          className={`w-full py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                            item.product.stock <= 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                          }`}
                          disabled={item.product.stock <= 0}
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {item.product.stock <= 0 ? 'Out of Stock' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sm:p-8 shadow-xl animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 rounded-full px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </MainLayout>
  )
}
