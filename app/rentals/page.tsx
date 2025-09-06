'use client'

import Link from "next/link"
import { Calendar, Filter, Grid3X3, List, MapPin, Star, Search, SlidersHorizontal, Truck, Wrench, Droplets, Warehouse, Car, Cog, Sprout, ChevronDown, Heart, Eye, Clock, CheckCircle, ArrowRight, Sparkles, Loader2, QrCode, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LazyImage } from "@/components/ui/lazy-image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useI18n } from "@/lib/i18n-context"


export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [locationFilter, setLocationFilter] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Dynamic data states
  const [categories, setCategories] = useState<any[]>([])
  const [rentalItems, setRentalItems] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingRentals, setIsLoadingRentals] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const { t, locale } = useI18n()

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const response = await fetch('/api/categories?type=RENTAL')
        const data = await response.json()

        if (response.ok) {
          // Handle different response structures
          const categoriesData = data.categories || data || []

          // Transform categories for the UI
          const transformedCategories = categoriesData.map((category: any) => {
            // Map category names to icons and colors
            const categoryConfig: any = {
              'Tractor': { icon: Truck, color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700" },
              'Harvester': { icon: Sprout, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700" },
              'Tools': { icon: Wrench, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700" },
              'Irrigation': { icon: Droplets, color: "bg-cyan-500", bgColor: "bg-cyan-50", textColor: "text-cyan-700" },
              'Storage': { icon: Warehouse, color: "bg-purple-500", bgColor: "bg-purple-50", textColor: "text-purple-700" },
              'Transport': { icon: Car, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700" },
              'Processing': { icon: Cog, color: "bg-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700" },
            }

            const config = categoryConfig[category.name_en] || {
              icon: Cog,
              color: "bg-gray-500",
              bgColor: "bg-gray-50",
              textColor: "text-gray-700"
            }

            return {
              id: category.slug || category.name_en?.toLowerCase().replace(/\s+/g, '-') || category.id,
              name: locale === 'ta' ? (category.name_ta || category.name_en) : (category.name_en || category.name),
              name_en: category.name_en || category.name,
              name_ta: category.name_ta || category.name_en,
              count: category._count?.products || 0,
              icon: config.icon,
              color: config.color,
              bgColor: config.bgColor,
              textColor: config.textColor,
            }
          })

          // Add "All" category option at the beginning (only once)
          const allCategories = [
            {
              id: 'all',
              name: 'All Categories',
              count: transformedCategories.reduce((total: number, cat: any) => total + (cat.count || 0), 0),
              icon: Truck,
              color: "bg-gray-500",
              bgColor: "bg-gray-50",
              textColor: "text-gray-700"
            },
            ...transformedCategories
          ]

          setCategories(allCategories)
        } else {
          throw new Error(data.error || 'Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to load categories')
        toast({
          title: "Error",
          description: "Failed to load equipment categories",
          variant: "destructive"
        })
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [toast])

  // Fetch rental items from API with search and filters
  const fetchRentals = async (page = 1, append = false) => {
    try {
      setIsLoadingRentals(true)

      // Build API URL with all parameters
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      if (locationFilter.trim()) {
        params.append('location', locationFilter.trim())
      }
      params.append('limit', '20')
      params.append('page', page.toString())

      const apiUrl = `/api/rentals?${params.toString()}`

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (response.ok) {
        const newRentals = data.rentals || []
        if (append) {
          setRentalItems(prev => [...prev, ...newRentals])
        } else {
          setRentalItems(newRentals)
        }
        setHasMore(data.hasMore || false)
      } else {
        throw new Error(data.error || 'Failed to fetch rentals')
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
      setError('Failed to load rental equipment')
      toast({
        title: "Error",
        description: "Failed to load rental equipment",
        variant: "destructive"
      })
    } finally {
      setIsLoadingRentals(false)
    }
  }

  // Handle search with debouncing
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // Handle location filter
  const handleLocationChange = (location: string) => {
    setLocationFilter(location)
    setCurrentPage(1)
    if (location.trim()) {
      setActiveFilters(prev => [...prev.filter(f => f !== 'location'), 'location'])
    } else {
      setActiveFilters(prev => prev.filter(f => f !== 'location'))
    }
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    if (category !== 'all') {
      setActiveFilters(prev => [...prev.filter(f => f !== 'category'), 'category'])
    } else {
      setActiveFilters(prev => prev.filter(f => f !== 'category'))
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setSelectedCategory("all")
    setActiveFilters([])
    setCurrentPage(1)
  }

  // Load more items
  const loadMore = () => {
    if (hasMore && !isLoadingRentals) {
      fetchRentals(currentPage + 1, true)
      setCurrentPage(prev => prev + 1)
    }
  }

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchRentals(1, false)
    setCurrentPage(1)
  }, [searchQuery, locationFilter])

  // Separate effect for category changes
  useEffect(() => {
    if (selectedCategory !== undefined) {
      fetchRentals(1, false)
      setCurrentPage(1)
    }
  }, [selectedCategory])



  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/8 rounded-full animate-float-fast"></div>
            <div className="absolute top-1/3 right-10 text-white/20 text-6xl animate-sway">🚜</div>
            <div className="absolute bottom-20 right-1/3 text-white/15 text-5xl animate-sway-delayed">🌾</div>
            <div className="absolute top-16 left-1/3 text-white/25 text-4xl animate-float-slow">⚙️</div>
          </div>

          <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Premium Equipment Rental</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('rentals.title').split(' ')[0]} <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{t('rentals.title').split(' ').slice(1).join(' ')}</span>
                <br className="hidden sm:block" />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-normal text-green-100">{t('rentals.subtitle')}</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                {t('rentals.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button className="bg-white text-green-700 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg" size="lg" asChild>
                  <Link href="/rentals/list" className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {t('rentals.listYourEquipment')}
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/50 text-green-700 bg-white hover:bg-gray-100 hover:scale-105 transition-all duration-300 backdrop-blur-sm" size="lg">
                  <Eye className="h-5 w-5 mr-2" />
                  {t('rentals.browseEquipment')}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-80">Equipment Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">50+</div>
                  <div className="text-sm opacity-80">Happy Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">4.8★</div>
                  <div className="text-sm opacity-80">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1">24/7</div>
                  <div className="text-sm opacity-80">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-16 lg:h-20">
              <path fill="#f8fafc" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        <div className="container mx-auto py-8 px-4">
          <Breadcrumbs />

          {/* Search and Filter Section */}
          <section className="mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={t('rentals.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="h-12 px-4 border-2 hover:border-green-500 transition-colors">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    Filters
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>

                  <div className="relative">
                    <Button
                      variant="outline"
                      className="h-12 px-4 border-2 hover:border-green-500 transition-colors"
                      onClick={() => {
                        const locationInput = document.getElementById('location-input') as HTMLInputElement;
                        if (locationInput) {
                          locationInput.focus();
                        }
                      }}
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Location
                    </Button>
                    <Input
                      id="location-input"
                      placeholder="Enter location..."
                      value={locationFilter}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="absolute top-full left-0 mt-2 w-64 h-10 text-sm border-2 border-gray-200 focus:border-green-500 transition-colors"
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="flex border-2 border-gray-200 rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-12 px-4 rounded-none border-0"
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-12 px-4 rounded-none border-0"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {activeFilters.includes('location') && locationFilter && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    📍 {locationFilter}
                    <button
                      onClick={() => handleLocationChange("")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {activeFilters.includes('category') && selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    📂 {selectedCategory}
                    <button
                      onClick={() => handleCategorySelect("all")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </Card>
          </section>

          {/* Categories Horizontal Scroll - Like Product Page */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-600" />
              {t('rentals.browseByCategory')}
            </h3>
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 px-1">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => handleCategorySelect("all")}
                  className={`rounded-full px-6 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                  size="sm"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  {t('common.allCategories')}
                </Button>
                {isLoadingCategories ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-full px-6 py-3 animate-pulse flex-shrink-0">
                      <div className="w-20 h-4 bg-gray-300 rounded"></div>
                    </div>
                  ))
                ) : (
                  categories.map((category) => {
                    const IconComponent = category.icon
                    return (
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
                        <IconComponent className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    )
                  })
                )}
              </div>

              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-60"></div>
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-60"></div>
            </div>
          </div>


          {/* All rentals */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t('rentals.availableEquipment')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoadingRentals ? t('common.loading') : `${rentalItems.length} ${t('rentals.equipmentFound')}`}
                </p>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Equipment Grid */}
            {isLoadingRentals ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden border animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : rentalItems.length > 0 ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}>
                {rentalItems.map((item) => (
                  <RentalCard key={item.id} item={item} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Equipment Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || locationFilter || selectedCategory !== 'all'
                    ? "Try adjusting your search criteria or filters to find more equipment."
                    : "We're working on adding equipment to our platform. Check back soon!"
                  }
                </p>
                {(searchQuery || locationFilter || selectedCategory !== 'all') && (
                  <Button variant="outline" onClick={clearAllFilters} className="border-green-300 text-green-700 hover:bg-green-50">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Load More */}
            {hasMore && rentalItems.length > 0 && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingRentals}
                  className="px-8 py-3 border-2 border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600 transition-all duration-300"
                >
                  {isLoadingRentals ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {t('rentals.loadMore')}
                    </>
                  )}
                </Button>
              </div>
            )}
          </section>

          {/* How it works */}
          <section className="mt-16 mb-10">
            <h2 className="text-2xl font-bold mb-8 text-center">{t('rentals.howRentingWorks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('rentals.bookOnline')}</h3>
                <p className="text-gray-600">
                  {t('rentals.bookOnlineDesc')}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('rentals.confirmAndPay')}</h3>
                <p className="text-gray-600">
                  {t('rentals.confirmAndPayDesc')}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('rentals.useAndReturn')}</h3>
                <p className="text-gray-600">
                  {t('rentals.useAndReturnDesc')}
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16">
            <div className="bg-green-50 border border-green-100 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('rentals.haveEquipmentToRent')}</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t('rentals.rentOutDescription')}
              </p>
              <Button className="bg-green-500 hover:bg-green-600" size="lg" asChild>
                <Link href="/rentals/list">{t('rentals.listYourEquipment')}</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

// Enhanced Rental Card Component with Store Link and QR Code
function RentalCard({ item, t }: { item: any, t: (key: string) => string }) {
  const [showQR, setShowQR] = useState(false)

  // Generate QR code for rental
  const generateRentalQR = (rental: any) => {
    const rentalUrl = `${window.location.origin}/rentals/${rental.slug}/${rental.publicKey}`
    setShowQR(true)
    // Copy URL to clipboard as well
    navigator.clipboard.writeText(rentalUrl).then(() => {
      console.log('Rental link copied:', rentalUrl)
    })
  }

  // Simple QR code generator (basic implementation)
  const generateQRCode = (text: string) => {
    // This is a very basic QR code representation
    // In production, you'd use a proper QR code library
    return (
      <div className="w-32 h-32 bg-white border-2 border-gray-300 flex items-center justify-center">
        <div className="text-center text-xs text-gray-500">
          <QrCode className="w-8 h-8 mx-auto mb-2" />
          <div>QR Code</div>
          <div className="text-xs mt-1 break-all">{text.substring(0, 20)}...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
        {/* Rental Image */}
        <div className="relative h-56 overflow-hidden">
          <LazyImage
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              <Badge className="bg-white/90 text-gray-800 hover:bg-white border-0 shadow-sm">
                {item.category}
              </Badge>
              {item.featured && (
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  // Add wishlist functionality here if needed
                }}
                className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  generateRentalQR(item)
                }}
                className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <QrCode className="w-5 h-5 text-gray-600 hover:text-green-600" />
              </button>
            </div>
          </div>

          {/* Availability Indicator */}
          {item.available && (
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                <CheckCircle className="h-3 w-3" />
                {t('common.available')}
              </div>
            </div>
          )}
        </div>

        {/* Rental Details */}
        <div className="p-6">
          {/* Store Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/stores/${item.owner?.id || item.user?.id || 'store'}`}
                className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors truncate block"
              >
                {item.owner?.name || item.user?.name || 'Store Name'}
              </Link>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          </div>

          {/* Rental Title */}
          <Link href={`/rentals/${item.slug}/${item.publicKey}`}>
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors cursor-pointer">
              {item.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline mb-3">
            <div className="text-2xl font-bold text-green-600">
              ₹{item.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 ml-2">
              {item.period === 'day' ? t('common.perDay') : t('common.perHour')}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 ml-1">{item.rating}</span>
            </div>
            <span className="text-sm text-gray-500 ml-2">({item.reviews} {t('common.reviews')})</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/rentals/${item.slug}/${item.publicKey}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Eye className="h-4 w-4 mr-2" />
                {t('common.viewDetails')}
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="border-2 hover:border-green-500 transition-colors">
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t('rentals.shareEquipment')}</h3>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>

            <div className="text-center space-y-6">
              {/* QR Code Display */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                {generateQRCode(`${window.location.origin}/rentals/${item.slug}/${item.publicKey}`)}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{t('rentals.scanQRCode')}</p>
                <p className="text-xs text-gray-500">{t('common.copyLink')}</p>
              </div>

              {/* URL Display */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-600 break-all font-mono">
                  {`${window.location.origin}/rentals/${item.slug}/${item.publicKey}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/rentals/${item.slug}/${item.publicKey}`)
                    alert(t('rentals.linkCopied'))
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  {t('common.copyLink')}
                </Button>
                <Button
                  onClick={() => setShowQR(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('common.close')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
