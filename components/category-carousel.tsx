'use client';

import * as React from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Define the type for a single category, making it reusable
export interface Category {
  id: number;
  name_en: string;
  slug: string;
  icon?: string | null;
  image_url?: string | null;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {categories.map((category) => (
            <div key={category.id} className="flex-shrink-0 flex-grow-0 basis-full min-w-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2">
              <Link href={`/categories/${category.slug}`} className="block group">
                <div className="bg-white rounded-lg border overflow-hidden text-center p-4 h-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.name_en} className="h-24 w-24 object-cover rounded-full mb-4" />
                  ) : (
                    <div className="h-24 w-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-4xl">{category.icon || '📦'}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600">{category.name_en}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md -translate-x-4"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md translate-x-4"
        onClick={scrollNext}
      >
        <ArrowRight className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  );
}
