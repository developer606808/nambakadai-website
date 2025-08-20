'use client';

import { useState, useEffect } from 'react';
import { CategoryCarousel } from '@/components/category-carousel';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for a single category
interface Category {
  id: number;
  name_en: string;
  slug: string;
  icon?: string | null;
  image_url?: string | null;
}

// A placeholder component to show while data is loading
function LoadingSkeleton() {
  return (
    <div className="flex justify-center space-x-4">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-32 w-32 rounded-full" />
    </div>
  );
}

export function CategorySectionClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories.');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Browse Categories</h2>
        <p className="text-xl text-gray-600">Discover fresh produce and farming essentials</p>
      </div>

      {loading && <LoadingSkeleton />}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && (
        categories.length > 0 ? (
          <CategoryCarousel categories={categories} />
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )
      )}
    </div>
  );
}