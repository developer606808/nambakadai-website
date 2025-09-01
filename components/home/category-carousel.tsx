"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryWithCounts, getCategoryIcon, getCategoryBgColor } from '@/lib/services/categoryService'

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
    <section className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{title}</h2>
        {showViewAll && (
          <Link href="/categories" className="text-sm text-green-600 hover:underline flex items-center self-start sm:self-auto">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        {isClient && categories.length > visibleItems && (
          <>
            <Button
              variant="outline"
              size="sm"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 p-0 shadow-md ${
                !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 p-0 shadow-md ${
                !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Categories Grid */}
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-8"
        >
          {visibleCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
            />
          ))}
          
          {/* View All Button */}
          {showViewAll && currentIndex + visibleItems >= categories.length && (
            <Link href="/categories">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Plus className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-xs text-gray-500 text-center">View All</span>
              </div>
            </Link>
          )}
        </div>

        {/* Dots Indicator */}
        {categories.length > visibleItems && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(categories.length / visibleItems) }, (_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / visibleItems) === i
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
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
function CategoryItem({ category }: { category: CategoryWithCounts }) {
  const icon = category.image ? null : getCategoryIcon(category.name_en)
  const bgColor = getCategoryBgColor(category.name_en, category.type)

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-2 relative overflow-hidden`}>
          {category.image && category.image.startsWith('http') ? (
            <Image
              src={category.image}
              alt={category.name_en}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xl">{icon}</span>
          )}
        </div>
        <span className="text-xs text-center font-medium text-gray-800 mb-1">
          {category.name_en}
        </span>
        <span className="text-xs text-center text-gray-500">
          {category.name_ta}
        </span>
        {category._count && category._count.products > 0 && (
          <span className="text-xs text-green-600 mt-1">
            {category._count.products} items
          </span>
        )}
      </div>
    </Link>
  )
}
