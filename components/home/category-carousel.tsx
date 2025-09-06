"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryWithCounts, getCategoryIcon, getCategoryBgColor } from '@/lib/services/categoryService'
import { useI18n } from '@/lib/i18n-context'

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
  const { t } = useI18n()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

  // Check scroll position to update button states
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [categories])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isScrolling) return

    setIsScrolling(true)
    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })

    setTimeout(() => setIsScrolling(false), 300)
  }

  if (categories.length === 0) {
    return (
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Categories Available</h3>
          <p className="text-gray-600">Check back later for new categories!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Enhanced Header with Animation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Discover amazing products by category</p>
          </div>
        </div>
        {showViewAll && (
          <Link href="/categories">
            <Button className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              View All Categories
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative group">
        {/* Navigation Buttons - Only show on hover or touch devices */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-80 md:opacity-0 ${
            canScrollLeft ? 'hover:shadow-2xl hover:bg-white' : ''
          }`}
        >
          <ChevronRight className="h-6 w-6 text-gray-700 rotate-180 mx-auto" />
        </button>

        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-80 md:opacity-0 ${
            canScrollRight ? 'hover:shadow-2xl hover:bg-white' : ''
          }`}
        >
          <ChevronRight className="h-6 w-6 text-gray-700 mx-auto" />
        </button>

        {/* Scrollable Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}

          {/* View All Card */}
          {showViewAll && (
            <Link href="/categories">
              <div className="flex-shrink-0 w-48 sm:w-56 h-48 sm:h-56 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 hover:border-green-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Plus className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-green-700 group-hover:text-green-800 transition-colors">
                  View All
                </span>
                <span className="text-xs text-green-600 mt-1 opacity-75">
                  {categories.length}+ categories
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.min(categories.length, 5) }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-300 rounded-full transition-all duration-300 hover:bg-green-400"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Category Card Component
function CategoryCard({ category, index }: { category: CategoryWithCounts; index: number }) {
  const { t, locale } = useI18n()
  const icon = category.image ? null : getCategoryIcon(category.name_en)
  const bgColor = getCategoryBgColor(category.name_en, category.type)

  // Get display names based on current locale from i18n context
  const primaryName = locale === 'ta' ? category.name_ta : category.name_en
  const secondaryName = locale === 'ta' ? category.name_en : category.name_ta

  return (
    <Link href={`/categories/${category.slug}`}>
      <div
        className="flex-shrink-0 w-48 sm:w-56 group cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 border border-gray-100 hover:border-green-200 overflow-hidden h-48 sm:h-56">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Top section with icon/image */}
          <div className="relative p-6 pb-4">
            <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 mx-auto`}>
              {category.image && category.image.startsWith('http') ? (
                <Image
                  src={category.image}
                  alt={primaryName}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{icon}</span>
              )}
            </div>

            {/* Floating badge for product count */}
            {category._count && category._count.products > 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                {category._count.products}
              </div>
            )}
          </div>

          {/* Bottom section with text */}
          <div className="relative px-6 pb-6">
            {/* Primary name */}
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 group-hover:text-green-700 transition-colors duration-300 text-center line-clamp-2 leading-tight">
              {primaryName}
            </h3>

            {/* Secondary name (if different) */}
            {secondaryName && secondaryName !== primaryName && (
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 text-center line-clamp-1">
                {secondaryName}
              </p>
            )}

            {/* Category type indicator */}
            <div className="mt-3 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                category.type === 'STORE'
                  ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                  : 'bg-green-100 text-green-700 group-hover:bg-green-200'
              } transition-colors duration-300`}>
                {category.type === 'STORE' ? 'Products' : 'Rentals'}
              </span>
            </div>
          </div>

          {/* Hover effect border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
        </div>
      </div>
    </Link>
  )
}
