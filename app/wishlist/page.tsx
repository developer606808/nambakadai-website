'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
<<<<<<< Updated upstream
import MainLayout from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
=======
import { MainLayout } from "@/components/main-layout"
import { useWishlist } from "@/hooks/useWishlist"

interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product: {
    id: number;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
}
>>>>>>> Stashed changes

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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border p-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {!session?.user ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Please sign in</h3>
            <p className="text-gray-500 mb-6">You need to be logged in to view your wishlist</p>
            <Link href="/login">
              <Button className="bg-green-500 hover:bg-green-600">Sign In</Button>
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you like for future reference</p>
            <Link href="/products">
              <Button className="bg-green-500 hover:bg-green-600">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{wishlistItems.length} Items</h2>
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
                >
                  {clearingAll ? 'Clearing...' : 'Clear All'}
                </Button>
              </div>
            </div>

            <div className="divide-y">
              {wishlistItems.map((item: WishlistItem) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-green-600 font-medium">${item.product.price.toFixed(2)}</p>
                      {item.product.stock <= 0 && (
                        <span className="ml-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={item.product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}
                      disabled={item.product.stock <= 0}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        try {
                          await removeFromWishlist(item.productId);
                          // Refresh the wishlist to update the UI
                          await refreshWishlist();
                        } catch (error) {
                          console.error('Error removing item from wishlist:', error);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
