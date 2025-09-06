'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the banner type for the home page
export interface HomeBanner {
  id: number;
  title: string;
  image: string;
  url: string | null;
  position: number;
}

// Banner carousel component
export function BannerSection() {
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?active=true');
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const result = await response.json();
        setBanners(result.data || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <section className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {loading ? (
        <BannerSkeleton />
      ) : banners.length === 0 ? (
        <EmptyBannerState />
      ) : (
        <BannerCarousel banners={banners} />
      )}
    </section>
  );
}

// Client component for banner carousel with sliding functionality
function BannerCarousel({ banners }: { banners: HomeBanner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

      {/* Banner Image */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
        <Image
          src={currentBanner.image || '/placeholder.svg'}
          alt={currentBanner.title}
          fill
          className="object-cover transition-all duration-700 ease-in-out"
          priority={currentIndex === 0}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />

        {/* Banner Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-20">
          <div className="max-w-2xl">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
              {currentBanner.title}
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 leading-relaxed drop-shadow-md">
              Discover fresh, organic products directly from local farmers and trusted vendors
            </p>
            {currentBanner.url && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                asChild
              >
                <Link href={currentBanner.url}>
                  Explore Now
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 z-30 transition-all duration-300 hover:scale-110"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 z-30 transition-all duration-300 hover:scale-110"
              aria-label="Next banner"
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </button>
          </>
        )}

        {/* Banner indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress bar for auto-play */}
        {banners.length > 1 && isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{
                width: `${((currentIndex + 1) / banners.length) * 100}%`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton component
export function BannerSkeleton() {
  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden h-[400px] md:h-[500px] shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="absolute bottom-8 left-8 right-8 z-20">
        <div className="h-8 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
        <div className="h-6 bg-white/15 rounded-lg w-3/4 mb-4 animate-pulse"></div>
        <div className="h-12 bg-white/10 rounded-lg w-32 animate-pulse"></div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyBannerState() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 rounded-xl overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent"></div>
      <div className="text-center z-10 max-w-2xl px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Welcome to Nambakadai
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
          Connect directly with local farmers and discover fresh, organic products delivered straight to your door
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" asChild>
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300" asChild>
            <Link href="/stores">
              Find Stores
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
