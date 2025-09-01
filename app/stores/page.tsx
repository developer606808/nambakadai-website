'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, ChevronLeft, ChevronRight, QrCode, Store, Package, Users, Heart, Share2, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MainLayout } from "@/components/main-layout";
import { useToast } from "@/components/ui/use-toast";

interface Store {
  id: number;
  name: string;
  slug: string;
  publicKey: string;
  description: string;
  logo: string | null;
  banner: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  isApproved: boolean;
  isBlocked: boolean;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
    ratings: number;
  };
}

interface City {
  id: number;
  name_en: string;
  name_ta: string;
  stateId: number;
}

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
  slug: string;
}

export default function StoresPage() {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedStoreForQR, setSelectedStoreForQR] = useState<Store | null>(null);

  const storesPerPage = 12;

  // Fetch stores data
  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: storesPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCity && { cityId: selectedCity }),
        ...(selectedCategory && { categoryId: selectedCategory }),
      });

      const response = await fetch(`/api/stores?${params}`);
      if (!response.ok) throw new Error('Failed to fetch stores');

      const data = await response.json();
      setStores(data.stores || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalStores(data.pagination?.totalCount || 0);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: "Error",
        description: "Failed to load stores. Please try again.",
        variant: "destructive",
      });
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities and categories
  const fetchFilters = async () => {
    try {
      const [citiesRes, categoriesRes] = await Promise.all([
        fetch('/api/cities'),
        fetch('/api/categories?type=STORE&limit=50')
      ]);

      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        setCities(citiesData.cities || []);
      } else {
        console.error('Cities API error:', citiesRes.status);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      } else {
        console.error('Categories API error:', categoriesRes.status);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      toast({
        title: "Error",
        description: "Failed to load filter options. Some features may not work properly.",
        variant: "destructive",
      });
    }
  };

  // Generate QR code for store
  const generateStoreQR = (store: Store) => {
    const storeUrl = `${window.location.origin}/stores/${store.slug}/${store.publicKey}`;
    // In a real implementation, you'd use a QR code library here
    // For now, we'll just copy the URL
    navigator.clipboard.writeText(storeUrl).then(() => {
      toast({
        title: "Store link copied!",
        description: "Share this link to show others this store.",
      });
    });
    setSelectedStoreForQR(store);
    setQrDialogOpen(true);
  };

  // Handle share store
  const handleShareStore = (store: Store) => {
    const storeUrl = `${window.location.origin}/stores/${store.slug}/${store.publicKey}`;
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

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchStores();
  }, [currentPage, searchTerm, selectedCity, selectedCategory]);

  // Effect to fetch filters on mount
  useEffect(() => {
    fetchFilters();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStores();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto py-8 px-4 lg:px-6">
          {/* Header Section */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 lg:mb-0 lg:mr-8 shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block lg:inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Local Stores
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Discover trusted local stores and farmers in your area. Fresh products, great prices, and direct from the source.
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
                    placeholder="Search stores by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchStores()}
                    className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className="lg:col-span-2">
                <Select value={selectedCity || "all"} onValueChange={(value) => setSelectedCity(value === "all" ? "" : value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
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

              {/* Category Filter */}
              <div className="lg:col-span-2">
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 h-12">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 ${viewMode === 'grid' ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-200 hover:border-green-300'}`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 ${viewMode === 'list' ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-200 hover:border-green-300'}`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Filter Button */}
              <div className="lg:col-span-2">
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setSelectedCategory('');
                    setCurrentPage(1);
                    fetchStores();
                  }}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-semibold text-gray-900">
                  {loading ? 'Discovering stores...' : `Found ${totalStores} amazing stores`}
                </p>
                <p className="text-sm text-gray-600">
                  {loading ? 'Please wait...' : `Page ${currentPage} of ${totalPages}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Trusted local sellers
                </span>
              </div>
            </div>
          </div>

          {/* Stores Display */}
          {loading ? (
            <div className={`grid gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(viewMode === 'grid' ? 12 : 6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stores.length > 0 ? (
            <div className={`grid gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
                  {/* Store Banner/Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={store.logo || "/placeholder.svg"}
                      alt={store.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {store.isApproved && (
                          <Badge className="bg-green-500 text-white border-0 shadow-sm">
                            ✓ Verified Store
                          </Badge>
                        )}
                        {!store.isBlocked && (
                          <Badge className="bg-blue-500 text-white border-0 shadow-sm">
                            🟢 Active
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => generateStoreQR(store)}
                          className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        >
                          <QrCode className="w-5 h-5 text-gray-600 hover:text-green-600" />
                        </button>
                        <button
                          onClick={() => handleShareStore(store)}
                          className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        >
                          <Share2 className="w-5 h-5 text-gray-600 hover:text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="p-6">
                    {/* Store Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Store className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-green-700 transition-colors">
                            {store.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{store.address || 'Location not specified'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-semibold text-gray-900">4.5</span>
                      </div>
                    </div>

                    {/* Store Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {store.description || 'A trusted local store offering fresh, quality products.'}
                    </p>

                    {/* Store Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Package className="w-3 h-3 mr-1" />
                          <span>{store._count?.products || 0} products</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{store.followersCount || 0} followers</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          <span>{store._count?.ratings || 0} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/stores/${store.slug}/${store.publicKey}`}>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Store className="w-4 h-4 mr-2" />
                        Visit Store
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Stores Found</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any stores matching your criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setSelectedCategory('');
                    setCurrentPage(1);
                    fetchStores();
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  className="border-2 border-gray-300 hover:border-green-300 hover:bg-green-50 px-6 py-3 rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Try Different Search
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          pageNumber === currentPage
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
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </nav>
            </div>
          )}

          {/* QR Code Dialog */}
          <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-green-600" />
                  Store QR Code
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
                  <h3 className="font-semibold text-lg">{selectedStoreForQR?.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Scan this QR code to visit the store
                  </p>
                </div>
                <div className="flex space-x-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (selectedStoreForQR) {
                        handleShareStore(selectedStoreForQR);
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
  );
}
