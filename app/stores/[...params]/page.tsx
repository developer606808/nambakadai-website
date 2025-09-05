'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ChevronRight, Star, MapPin, Phone, Mail, Globe, Package, Users, Heart, MessageCircle, X, QrCode, Share2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/main-layout';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


export default function StoreDetailsPage({
  params
}: {
  params: Promise<{ params: string[] }>
}) {

  const { data: session } = useSession();
  const { wishlistStatus, toggleWishlist, checkWishlistStatus } = useWishlist();
  const { toast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [routeParams, setRouteParams] = useState<string[]>([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Check wishlist status for products
  useEffect(() => {
    if (store?.products && store.products.length > 0) {
      const productIds = store.products.map((p: any) => p.id);
      if (productIds.length > 0) {
        checkWishlistStatus(productIds);
      }
    }
  }, [store?.products, checkWishlistStatus]);

  // Get params on client side
  useEffect(() => {
    console.log('params', params)
    params.then((p) => {
      setRouteParams(p.params || []);
    });
  }, [params]);

  const [slug, publicKey] = routeParams || [];
  console.log('routeParams', routeParams)

  // Generate QR code for store URL
  useEffect(() => {
    if (slug && publicKey) {
      const storeUrl = `${window.location.origin}/stores/${slug}/${publicKey}`;
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toDataURL(storeUrl, { width: 200, margin: 2 })
          .then((url: string) => {
            setQrCodeUrl(url);
          })
          .catch((error: any) => {
            console.error('Error generating QR code:', error);
          });
      });
    }
  }, [slug, publicKey]);

  // Fetch store data
  useEffect(() => {
    console.log('slug', slug, 'publicKey', publicKey)
    if (!slug || !publicKey) return;

    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stores/${publicKey}`);
        if (!response.ok) {
          notFound();
          return;
        }

        const storeData = await response.json();
        setStore(storeData);

        // Check if user is following this store
        if (session?.user?.id) {
          const followResponse = await fetch(`/api/stores/${publicKey}/follow`);
          if (followResponse.ok) {
            const followData = await followResponse.json();
            setIsFollowing(followData.isFollowing);
          }
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [slug, publicKey, session]);

  // Fetch ratings data
  useEffect(() => {
    if (!publicKey) {
      console.log('No publicKey available for ratings fetch');
      return;
    }

    console.log('Fetching ratings for publicKey:', publicKey);

    const fetchRatingsData = async () => {
      try {
        const response = await fetch(`/api/stores/${publicKey}/ratings`);
        console.log('Ratings fetch response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Ratings data received:', data);
          setRatings(data.ratings);
          setAverageRating(data.averageRating);
          setTotalRatings(data.totalRatings);
        } else {
          console.log('Ratings fetch failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatingsData();
  }, [publicKey]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!session?.user?.id || !store) return;

    try {
      setFollowLoading(true);
      const response = await fetch(`/api/stores/${publicKey}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        // Update follower count
        setStore((prev: any) => ({
          ...prev,
          followersCount: data.isFollowing
            ? prev.followersCount + 1
            : prev.followersCount - 1
        }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!session?.user?.id || !store || !messageText.trim()) return;

    try {
      setSendingMessage(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: store.publicKey,
          content: messageText.trim(),
          messageType: 'text',
          metadata: {
            source: 'store_details_page',
            storeName: store.name
          }
        }),
      });

      if (response.ok) {
        setMessageText('');
        setMessageModalOpen(false);
        toast({
          title: "Message sent!",
          description: "Your message has been sent to the store successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to send message",
          description: errorData.error || 'Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle share store
  const handleShareStore = () => {
    const storeUrl = `${window.location.origin}/stores/${slug}/${publicKey}`;
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name} on Nanbakadai`,
        url: storeUrl,
      });
    } else {
      navigator.clipboard.writeText(storeUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Store link has been copied to clipboard",
        });
      });
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    console.log('handleRatingSubmit called');
    console.log('Session:', session);
    console.log('Store:', store);
    console.log('User rating:', userRating);
    console.log('Public key:', publicKey);

    if (!session?.user?.id || !store || userRating < 1 || userRating > 5) {
      console.log('Validation failed:', {
        hasSession: !!session?.user?.id,
        hasStore: !!store,
        userRating,
        isValidRating: userRating >= 1 && userRating <= 5
      });
      return;
    }

    try {
      setSubmittingRating(true);
      console.log('Making API request...');

      const requestBody = {
        value: userRating,
        comment: userComment.trim() || null
      };
      console.log('Request body:', requestBody);

      const response = await fetch(`/api/stores/${publicKey}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const newRating = await response.json();
        console.log('New rating:', newRating);

        // Update local state
        setRatings(prev => [newRating, ...prev.filter(r => r.userId !== parseInt(session.user.id))]);
        setUserRating(0);
        setUserComment('');

        // Refresh ratings data
        const ratingsResponse = await fetch(`/api/stores/${publicKey}/ratings`);
        if (ratingsResponse.ok) {
          const data = await ratingsResponse.json();
          setAverageRating(data.averageRating);
          setTotalRatings(data.totalRatings);
        }

        toast({
          title: "Rating submitted!",
          description: "Thank you for your feedback.",
        });
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        toast({
          title: "Failed to submit rating",
          description: errorData.error || 'Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!slug || !publicKey) {
    // notFound();
  }

  if (loading) {
    return (
      <>
        <MainLayout>
          <div className="min-h-screen bg-[#f9fcf7] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading store details...</p>
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  if (!store) {
    notFound();
  }

  // Use actual rating data from API
  const avgRating = averageRating;
  const productCount = store._count?.products || 0;
  const ratingCount = totalRatings;

  // Generate SEO data
  const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/stores/${slug}/${publicKey}` : '';
  const storeImage = store.logo || store.banner || '/placeholder.svg?height=630&width=1200';
  const storeTitle = `${store.name} - ${productCount} Products Available`;
  const storeDescription = store.description
    ? `${store.description.substring(0, 155)}...`
    : `${store.name} - Find quality products at great prices. ${productCount} products available with ${ratingCount} customer reviews.`;

  return (
    <>
      <Head>
        <title>{storeTitle} | Nambakadai</title>
        <meta name="description" content={storeDescription} />
        <meta name="keywords" content={`${store.name}, ${store.name} store, buy products, online shopping, ${store.name} products, verified store`} />
        <meta name="author" content={store.name} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href={storeUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={storeTitle} />
        <meta property="og:description" content={storeDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={storeUrl} />
        <meta property="og:image" content={storeImage} />
        <meta property="og:image:alt" content={`${store.name} store logo`} />
        <meta property="og:site_name" content="Nambakadai" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={storeTitle} />
        <meta name="twitter:description" content={storeDescription} />
        <meta name="twitter:image" content={storeImage} />
        <meta name="twitter:image:alt" content={`${store.name} store logo`} />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="msapplication-TileColor" content="#22c55e" />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="container mx-auto py-6 px-4 lg:px-6">
            {/* Store Hero Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 lg:p-8 mb-8 text-white shadow-xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/20 rounded-full"></div>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
                {/* Store Logo */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Image
                      src={store.logo || "/placeholder.svg"}
                      alt={store.name}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover"
                    />
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{store.name}</h1>
                  <p className="text-lg opacity-90 mb-4 max-w-2xl">{store.description}</p>

                  {/* Store Stats */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <span className="font-semibold">{productCount} Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">{store.followersCount || 0} Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span className="font-semibold">{avgRating} ({ratingCount} reviews)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    {session?.user?.id && (
                      <>
                        <Button
                          onClick={handleFollowToggle}
                          disabled={followLoading}
                          variant={isFollowing ? "outline" : "default"}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                            isFollowing
                              ? "border-white/50 text-white hover:bg-white/20 bg-white/10"
                              : "bg-white text-green-600 hover:bg-white/90 shadow-lg"
                          }`}
                        >
                          {followLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <Heart className={`w-5 h-5 ${isFollowing ? "fill-current" : ""}`} />
                          )}
                          {isFollowing ? "Following" : "Follow Store"}
                        </Button>

                        <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 px-6 py-3 rounded-xl border-white/50 text-white hover:bg-white/20 bg-white/10 font-medium">
                              <MessageCircle className="w-5 h-5" />
                              Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Send Message to {store.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea
                                  id="message"
                                  placeholder="Type your message here..."
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  rows={4}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setMessageModalOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSendMessage}
                                  disabled={sendingMessage || !messageText.trim()}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {sendingMessage ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  ) : null}
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}

                    {/* Share Button */}
                    <Button
                      onClick={handleShareStore}
                      variant="outline"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border-white/50 text-white hover:bg-white/20 bg-white/10 font-medium"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </Button>

                    {/* QR Code Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 px-6 py-3 rounded-xl border-white/50 text-white hover:bg-white/20 bg-white/10 font-medium">
                          <QrCode className="w-5 h-5" />
                          QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Store QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-4 bg-white rounded-lg border shadow-lg">
                            <Image
                              src={qrCodeUrl}
                              alt="Store QR Code"
                              width={200}
                              height={200}
                              className="w-full h-auto"
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            Scan this QR code to visit the store
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const storeUrl = `${window.location.origin}/stores/${slug}/${publicKey}`;
                              navigator.clipboard.writeText(storeUrl).then(() => {
                                toast({
                                  title: "Link copied!",
                                  description: "Store link has been copied to clipboard",
                                });
                              });
                            }}
                            className="w-full"
                          >
                            Copy Store Link
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {store.address && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-700">{store.address}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{store.phone}</span>
                      </div>
                    )}
                    {store.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{store.email}</span>
                      </div>
                    )}
                    {store.website && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <a href={store.website} className="text-sm text-blue-600 hover:text-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Description */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About This Store</h3>
                  {store.description ? (
                    <p className="text-gray-700 leading-relaxed">{store.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available for this store.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Store Products */}
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Products from {store.name}</h2>
                <Link href={`/stores/${slug}/${publicKey}/products`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    View All Products
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {store.products && store.products.length > 0 ? (
                <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide">
                  {store.products.map((product: any) => (
                    <div key={product.id} className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
                      {/* Product Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                          <div className="absolute top-4 left-4">
                            {product.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product.id);
                              }}
                              className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                            >
                              <Heart className={`w-5 h-5 ${wishlistStatus[product.id] ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                            </button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110">
                                  <QrCode className="w-5 h-5 text-gray-600 hover:text-green-600" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                  <DialogTitle>Product QR Code</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="p-4 bg-white rounded-lg border shadow-lg">
                                    <Image
                                      src={qrCodeUrl}
                                      alt="Product QR Code"
                                      width={200}
                                      height={200}
                                      className="w-full h-auto"
                                    />
                                  </div>
                                  <p className="text-sm text-gray-600 text-center">
                                    Scan this QR code to view the product
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const productUrl = `${window.location.origin}/products/${product.slug}/${product.publicKey}`;
                                      navigator.clipboard.writeText(productUrl).then(() => {
                                        toast({
                                          title: "Link copied!",
                                          description: "Product link has been copied to clipboard",
                                        });
                                      });
                                    }}
                                    className="w-full"
                                  >
                                    Copy Product Link
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-6">
                        {/* Store Info */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Image
                              src={store.logo || "/placeholder.svg"}
                              alt={store.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/stores/${slug}/${publicKey}`}
                              className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors truncate block"
                            >
                              {store.name}
                            </Link>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate">{store.address || 'Location not specified'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Product Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                          {product.title}
                        </h3>

                        {/* Product Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{product.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              per {product.unit.symbol}
                            </div>
                          </div>
                          <Link href={`/products/${product.slug}/${product.publicKey}`}>
                            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>

                        {/* Stock Info */}
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-500">
                            <Package className="w-3 h-3 mr-1" />
                            <span>{product.stock} in stock</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Heart className="w-3 h-3 mr-1" />
                            <span>{product.wishlistCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No products available</h3>
                  <p className="text-gray-500">This store doesn't have any products listed yet.</p>
                </div>
              )}
            </div>

            {/* Store Ratings & Reviews */}
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews & Ratings</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({totalRatings} reviews)</span>
                  </div>
                </div>

                {/* Rating Form */}
                {session?.user?.id && (
                  <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                    <h3 className="font-semibold mb-4">Write a Review</h3>
                    <div className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <Label className="text-sm font-medium">Your Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setUserRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= userRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {userRating > 0 && `${userRating} star${userRating > 1 ? 's' : ''}`}
                        </span>
                      </div>

                      {/* Comment */}
                      <div>
                        <Label htmlFor="review-comment" className="text-sm font-medium">
                          Your Review (Optional)
                        </Label>
                        <Textarea
                          id="review-comment"
                          placeholder="Share your experience with this store..."
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={handleRatingSubmit}
                          disabled={submittingRating || userRating < 1}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {submittingRating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : null}
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {ratings.length > 0 ? (
                    ratings.map((rating: any) => (
                      <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {rating.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{rating.user.name}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= rating.value
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {rating.comment && (
                              <p className="text-gray-700 mb-2">{rating.comment}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                      <p className="text-gray-500">Be the first to leave a review for this store!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}