'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import Breadcrumbs from "@/components/breadcrumbs";
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper";

interface CategoryData {
  id: number;
  name_en: string;
  name_ta: string;
  slug: string;
  icon?: string;
  _count: {
    products: number;
  };
  children?: Array<{
    id: number;
    name_en: string;
    name_ta: string;
    slug: string;
    _count: {
      products: number;
    };
  }>;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories?includeSubcategories=true');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Categories</h1>
            <p className="text-gray-600">
              Browse all product and service categories available on Nanbakadai Farm Marketplace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-full w-12 flex-shrink-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }


  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 lg:mb-0 lg:mr-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="inline-block lg:inline-block">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              All Categories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover all product and service categories available on our comprehensive farm marketplace platform.
            </p>
          </div>
        </div>

        <LazyLoadWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
                {/* Header with Parent Category */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-xl">{category.icon || '📁'}</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {category.name_en}
                        </h2>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {category.name_ta}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Count Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      {category._count.products} Products
                    </span>
                  </div>
                </div>

                {/* Subcategories Section */}
                <div className="p-4">
                  {category.children && category.children.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Subcategories
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.children.length}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {category.children.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/categories/${subcategory.slug}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 hover:border hover:border-gray-200 transition-all duration-200 group/subcategory"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">📄</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate group-hover/subcategory:text-blue-600 transition-colors">
                                  {subcategory.name_en}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {subcategory.name_ta}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {subcategory._count.products}
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover/subcategory:text-blue-500 group-hover/subcategory:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Direct Category</h3>
                      <p className="text-xs text-gray-500 mb-4">Browse products directly in this category</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="px-4 pb-4">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium text-sm text-center block"
                  >
                    Browse {category.name_en}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Categories Overview</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">{categories.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Categories</div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                  {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
                </div>
                <div className="text-sm font-medium text-gray-600">Total Products</div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                  {categories.filter(cat => cat._count.products > 0).length}
                </div>
                <div className="text-sm font-medium text-gray-600">Active Categories</div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1">
                  {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + cat._count.products, 0) / categories.length) : 0}
                </div>
                <div className="text-sm font-medium text-gray-600">Avg Products/Category</div>
              </div>
            </div>
          </div>
        </LazyLoadWrapper>
      </div>
    </>
  )
}
