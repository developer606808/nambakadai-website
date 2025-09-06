'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Heart, ChevronLeft, ChevronRight, MapPin, Store, QrCode, Star, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    slug?: string;
    publicKey?: string;
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

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
  slug: string;
  type: 'STORE' | 'RENTAL';
}

interface City {
  id: number;
  name_en: string;
  name_ta: string;
  stateId: number;
}

interface State {
  id: number;
  name_en: string;
  name_ta: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ProductsPage() {
  const { wishlistStatus, toggleWishlist, checkWishlistStatus } = useWishlist();
  const { toast } = useToast();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories?type=STORE&limit=50');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || data || []);
      } else {
        console.error('Categories API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch states
  const fetchStates = useCallback(async () => {
    try {
      const response = await fetch('/api/states');
      if (response.ok) {
        const data = await response.json();
        setStates(data.states || []);
      } else {
        console.error('States API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      toast({
        title: "Error",
        description: "Failed to load states. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch cities
  const fetchCities = useCallback(async (stateId?: number) => {
    try {
      const url = stateId ? `/api/cities?stateId=${stateId}` : '/api/cities';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      } else {
        console.error('Cities API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast({
        title: "Error",
        description: "Failed to load cities. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch products
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
      });

      if (selectedCategory) {
        params.append('categoryId', selectedCategory.toString());
      }

      if (selectedState) {
        params.append('stateId', selectedState.toString());
      }

      if (selectedCity) {
        params.append('cityId', selectedCity.toString());
      }

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
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedState, selectedCity, searchQuery, sortBy, priceRange, checkWishlistStatus, toast]);

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchStates();
    fetchProducts(1);
  }, []); // Remove fetchProducts from dependencies to prevent infinite loop

  // Handle category changes
  useEffect(() => {
    if (selectedCategory !== null || selectedCategory === null) {
      fetchProducts(1);
    }
  }, [selectedCategory]);

  // Handle state changes
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
      setSelectedCity(null); // Reset city when state changes
    } else {
      setCities([]);
      setSelectedCity(null);
    }
    fetchProducts(1);
  }, [selectedState, fetchCities]);

  // Handle city changes
  useEffect(() => {
    fetchProducts(1);
  }, [selectedCity]);

  // Handle sort changes
  useEffect(() => {
    fetchProducts(1);
  }, [sortBy]);

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    // fetchProducts(1) will be called by useEffect when selectedCategory changes
  };

  // Handle state selection
  const handleStateSelect = (stateId: number | null) => {
    setSelectedState(stateId);
    // fetchProducts(1) will be called by useEffect when selectedState changes
  };

  // Handle city selection
  const handleCitySelect = (cityId: number | null) => {
    setSelectedCity(cityId);
    // fetchProducts(1) will be called by useEffect when selectedCity changes
  };

  // Handle search
  const handleSearch = () => {
    fetchProducts(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // fetchProducts(1) will be called by useEffect when sortBy changes
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
    setSelectedCategory(null);
    setSelectedState(null);
    setSelectedCity(null);
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
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto py-8 px-4 lg:px-6">
          {/* Header Section */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 lg:mb-0 lg:mr-8 shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block lg:inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                All Products
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Discover fresh, organic products from local farmers and trusted sellers in your area
              </p>
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
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
              </div>

              {/* State Filter */}
              <div className="lg:col-span-2">
                <Select value={selectedState?.toString() || "all"} onValueChange={(value) => handleStateSelect(value === "all" ? null : parseInt(value))}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="lg:col-span-2">
                <Select
                  value={selectedCity?.toString() || "all"}
                  onValueChange={(value) => handleCitySelect(value === "all" ? null : parseInt(value))}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl disabled:opacity-50">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="lg:col-span-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Button */}
              <div className="lg:col-span-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full h-12 border-2 border-gray-200 hover:border-green-500 rounded-xl flex items-center justify-center"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  More Filters
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

          {/* Categories Horizontal Scroll */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Browse by Category
            </h3>
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 px-1">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => handleCategorySelect(null)}
                  className={`rounded-full px-6 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                  size="sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  All Categories
                </Button>
                {Array.isArray(categories) && categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`rounded-full px-6 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                        : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }`}
                    size="sm"
                  >
                    {category.name_en}
                  </Button>
                ))}
              </div>

              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-60"></div>
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-60"></div>
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
                {selectedCategory
                  ? `No products found in this category. Try selecting a different category or clearing your filters.`
                  : 'No products available at the moment. Check back later for new listings.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedCategory && (
                  <Button
                    variant="outline"
                    onClick={() => handleCategorySelect(null)}
                    className="border-2 border-gray-300 hover:border-green-300 hover:bg-green-50 px-6 py-3 rounded-xl"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View All Categories
                  </Button>
                )}
                <Button
                  onClick={handleResetFilters}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear All Filters
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
                            href={`/stores/${product.store.slug || 'store'}/${product.store.publicKey || product.store.id}`}
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
                        const pageNum = Math.max(1, pagination.page - 2) + i;
                        if (pageNum > pagination.totalPages) return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${
                              pageNum === pagination.page
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                                : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            {pageNum}
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
        </div>
      </div>
    </MainLayout>
  )
}
