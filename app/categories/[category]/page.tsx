'use client';

import { use, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Heart, ChevronLeft, ChevronRight, QrCode, Share2, Star, Package, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MainLayout } from "@/components/main-layout";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  store: {
    id: number;
    name: string;
    logo?: string;
  };
  location: string;
  unit: {
    symbol: string;
    name: string;
  };
  stock: number;
  isFeatured: boolean;
  wishlistCount: number;
  createdAt: string;
  slug: string;
  publicKey: string;
}

interface CategoryData {
  id: number;
  name_en: string;
  name_ta: string;
  slug: string;
  icon?: string;
  _count: {
    products: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
  const { wishlistStatus, toggleWishlist, checkWishlistStatus } = useWishlist();
  const { toast } = useToast();

  // State management
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch category details and all categories
  const fetchCategoryDetails = useCallback(async () => {
    try {
      setCategoryLoading(true);
      const response = await fetch(`/api/categories?type=STORE&includeSubcategories=true`);
      if (response.ok) {
        const data = await response.json();
        // Handle both response formats: { categories, total } or direct array
        const categoriesData = data.categories || data;
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [categoriesData];

        // Set all categories for the horizontal scroll
        setCategories(categoriesArray);

        const foundCategory = categoriesArray.find((cat: CategoryData) => cat.slug === categorySlug);
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError('Category not found');
        }
      } else {
        setError('Failed to fetch category details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching category:', err);
    } finally {
      setCategoryLoading(false);
    }
  }, [categorySlug]);

  // Fetch products for this category
  const fetchProducts = useCallback(async (page = 1) => {
    if (!category) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        categoryId: category.id.toString(),
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (priceRange.min) {
        params.append('minPrice', priceRange.min);
      }

      if (priceRange.max) {
        params.append('maxPrice', priceRange.max);
      }

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);

        // Check wishlist status for these products
        const productIds = data.products.map((p: Product) => p.id);
        if (productIds.length > 0) {
          await checkWishlistStatus(productIds);
        }
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, sortBy, priceRange, checkWishlistStatus]);

  // Initialize data
  useEffect(() => {
    fetchCategoryDetails();
  }, [fetchCategoryDetails]);

  // Fetch products when category is loaded
  useEffect(() => {
    if (category) {
      fetchProducts(1);
    }
  }, [category, fetchProducts]);

  // Handle search
  const handleSearch = () => {
    fetchProducts(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // fetchProducts will be called by useEffect when sortBy changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    fetchProducts(1);
    setShowFilters(false);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setSortBy("newest");
    fetchProducts(1);
    setShowFilters(false);
  };

  // Generate QR code for product
  const generateProductQR = (product: Product) => {
    const productUrl = `${window.location.origin}/products/${product.slug}/${product.publicKey}`;
    // In a real implementation, you'd use a QR code library here
    // For now, we'll just copy the URL
    navigator.clipboard.writeText(productUrl).then(() => {
      toast({
        title: "Product link copied!",
        description: "Share this link to show others this product.",
      });
    });
    setSelectedProductForQR(product);
    setQrDialogOpen(true);
  };

  // Handle share product
  const handleShareProduct = (product: Product) => {
    const productUrl = `${window.location.origin}/products/${product.slug}/${product.publicKey}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Nanbakadai`,
        url: productUrl,
      });
    } else {
      navigator.clipboard.writeText(productUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      });
    }
  };

  if (categoryLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !category) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Category</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto py-6 px-4 lg:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Category Hero */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 lg:p-8 mb-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold mb-2">{category?.name_en}</h1>
                      <p className="text-lg opacity-90">Fresh and organic {category?.name_en.toLowerCase()} from local farmers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{category?._count.products} products available</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      <span className="font-semibold">4.5 average rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={`Search ${category?.name_en.toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="lg:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* Filter Button */}
                <div className="lg:col-span-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full h-12 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl flex items-center justify-center"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Clear Filters */}
                <div className="lg:col-span-2">
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="w-full h-12 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-xl"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex items-center mb-6">
                  <Filter className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                    <div className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Actions</label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleApplyFilters}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium"
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 px-6 py-3 rounded-xl font-medium"
                      >
                        Reset All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Browse Related Categories
              </h3>
              <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`flex-shrink-0 bg-white rounded-xl border-2 p-4 hover:shadow-lg transition-all duration-300 ${
                      cat.slug === categorySlug
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">{cat.icon || '📦'}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{cat.name_en}</h4>
                      <p className="text-xs text-gray-500">{cat._count.products} products</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse shadow-lg">
                  <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || priceRange.min || priceRange.max ?
                  `No products found matching your filters. Try adjusting your search criteria.` :
                  'No products available in this category at the moment. Check back later for new listings.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(searchQuery || priceRange.min || priceRange.max) && (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="border-2 border-gray-300 hover:border-green-300 hover:bg-green-50 px-6 py-3 rounded-xl"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Try Different Search
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
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
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          <Badge className="bg-white/90 text-gray-800 hover:bg-white border-0 shadow-sm">
                            {product.category.name}
                          </Badge>
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
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              generateProductQR(product);
                            }}
                            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                          >
                            <QrCode className="w-5 h-5 text-gray-600 hover:text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      {/* Store Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Image
                            src={product.store.logo || "/placeholder.svg"}
                            alt={product.store.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/stores/store/${product.store.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors truncate block"
                          >
                            {product.store.name}
                          </Link>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{product.location}</span>
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
                            View Details
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
                          <span>{product.wishlistCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Summary */}
              {pagination && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-lg font-semibold text-gray-900">
                        Showing {products.length} of {pagination.totalCount} products
                      </p>
                      <p className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Fast delivery available
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const pageNumber = Math.max(1, pagination.page - 2) + i;
                        if (pageNumber > pagination.totalPages) return null;

                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === pagination.page ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${
                              pageNumber === pagination.page
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                                : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}

          {/* QR Code Dialog */}
          <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-green-600" />
                  Product QR Code
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">QR Code Placeholder</p>
                      <p className="text-xs text-gray-400 mt-1">
                        In production, this would display the actual QR code
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{selectedProductForQR?.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Scan this QR code to view the product
                  </p>
                </div>
                <div className="flex space-x-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (selectedProductForQR) {
                        handleShareProduct(selectedProductForQR);
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    onClick={() => setQrDialogOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  )
}
