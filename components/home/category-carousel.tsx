"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryWithCounts, getCategoryIcon, getCategoryBgColor } from '@/lib/services/categoryService'

// Hook to get current language
function useLanguage() {
  const [currentLocale, setCurrentLocale] = useState('en')

  useEffect(() => {
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en'

    if (locale === 'en' || locale === 'ta') {
      setCurrentLocale(locale)
    }
  }, [])

  return currentLocale
}

interface CategoryCarouselProps {
  categories: CategoryWithCounts[]
  title?: string
  showViewAll?: boolean
}

export function CategoryCarousel({
  categories,
  title = "Browse Categories",
  showViewAll = true
}: CategoryCarouselProps) {
  const currentLocale = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Calculate how many items are visible at once (matching CSS breakpoints)
  const getVisibleItems = () => {
    if (typeof window === 'undefined') return 6 // Default for SSR
    if (window.innerWidth < 640) return 2  // sm
    if (window.innerWidth < 768) return 3  // md
    if (window.innerWidth < 1024) return 4 // lg
    if (window.innerWidth < 1280) return 5 // xl
    if (window.innerWidth < 1536) return 6 // 2xl
    return 7
  }

  const [visibleItems, setVisibleItems] = useState(6) // Default value for SSR
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag and initial visible items
    setIsClient(true)
    setVisibleItems(getVisibleItems())

    const handleResize = () => {
      setVisibleItems(getVisibleItems())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    updateScrollButtons()
  }, [currentIndex, Array.isArray(categories) ? categories.length : 0, visibleItems])

  const updateScrollButtons = () => {
    const categoriesLength = Array.isArray(categories) ? categories.length : 0
    setCanScrollLeft(currentIndex > 0)
    setCanScrollRight(currentIndex < categoriesLength - visibleItems)
  }

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(Math.min(categories.length - visibleItems, currentIndex + 1))
    }
  }

  const visibleCategories = Array.isArray(categories) ? categories.slice(currentIndex, currentIndex + visibleItems) : []

  if (categories.length === 0) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{title}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm sm:text-base">No categories available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">📂</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        {showViewAll && (
          <Link href="/categories" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative">
          {/* Enhanced Navigation Arrows - Mobile Optimized */}
          {isClient && categories.length > visibleItems && (
            <>
              <Button
                variant="outline"
                size="sm"
                className={`absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 shadow-lg border-2 border-white bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 ${
                  !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 shadow-lg border-2 border-white bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 ${
                  !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                onClick={scrollRight}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </Button>
            </>
          )}

        {/* Enhanced Categories Grid - Mobile First */}
        <div className="relative bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-4 sm:p-6 border border-green-100/50 shadow-sm">
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
          >
            {visibleCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                currentLocale={currentLocale}
              />
            ))}

            {/* Enhanced View All Button */}
            {showViewAll && currentIndex + visibleItems >= categories.length && (
              <Link href="/categories">
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-400 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg bg-white/50 hover:bg-white h-full min-h-[100px] sm:min-h-[120px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-2 shadow-sm">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <span className="text-xs sm:text-sm text-green-700 font-medium text-center">View All</span>
                </div>
              </Link>
            )}
          </div>
        </div>

          {/* Enhanced Dots Indicator - Mobile Optimized */}
          {categories.length > visibleItems && (
            <div className="flex justify-center mt-6 space-x-3">
              {Array.from({ length: Math.ceil(categories.length / visibleItems) }, (_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    Math.floor(currentIndex / visibleItems) === i
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-110'
                      : 'bg-gray-300 hover:bg-gray-400 hover:shadow-md'
                  }`}
                  onClick={() => setCurrentIndex(i * visibleItems)}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  )
}

// Individual Category Item Component
function CategoryItem({ category, currentLocale }: { category: CategoryWithCounts; currentLocale: string }) {
  const icon = category.image ? null : getCategoryIcon(category.name_en)
  const bgColor = getCategoryBgColor(category.name_en, category.type)

  // Get display name based on current locale
  const displayName = currentLocale === 'ta' ? category.name_ta : category.name_en
  const secondaryName = currentLocale === 'ta' ? category.name_en : category.name_ta

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100 hover:border-green-200 min-h-[100px] sm:min-h-[120px] relative overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon/Icon Container */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${bgColor} flex items-center justify-center mb-3 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
          {category.image && category.image.startsWith('http') ? (
            <Image
              src={category.image}
              alt={displayName}
              width={56}
              height={56}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-xl sm:text-2xl">{icon}</span>
          )}
        </div>

        {/* Category Name - Primary */}
        <span className="text-xs sm:text-sm text-center font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
          {displayName}
        </span>

        {/* Category Name - Secondary (only show if different from primary) */}
        {secondaryName && secondaryName !== displayName && (
          <span className="text-xs text-center text-gray-400 group-hover:text-gray-500 transition-colors line-clamp-1">
            {secondaryName}
          </span>
        )}

        {/* Product Count Badge */}
        {category._count && category._count.products > 0 && (
          <div className="mt-2 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
            <span className="text-xs text-green-700 font-medium">
              {category._count.products} items
            </span>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>
    </Link>
  )
}
