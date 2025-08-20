import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MainLayout from "@/components/main-layout";
import Breadcrumbs from "@/components/breadcrumbs";
import { CategoryCarousel } from "@/components/category-carousel"; // Assuming you have this for client-side interaction
import { Suspense } from "react";

export const metadata = {
  title: "All Categories | Nambakadai Farm Marketplace",
  description:
    "Browse all product and service categories on Nambakadai Farm Marketplace. Find fresh produce, farming equipment, tools, and more.",
};

// Define a type for our category data for type safety
export interface Category {
  id: number;
  name_en: string;
  slug: string;
  icon?: string | null;
  image_url?: string | null;
}

// Fetch data from our API endpoint
// This fetch request is automatically memoized by Next.js
async function getCategories(): Promise<Category[]> {
  // Construct the absolute URL for fetching on the server
  const url = new URL("/api/categories", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Revalidate data every hour
  });

  if (!res.ok) {
    // This will be caught by the nearest error.js boundary
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Categories</h1>
          <p className="text-gray-600">
            Browse all product and service categories available on Nambakadai Farm
            Marketplace.
          </p>
        </div>

        {/* Server-side rendered list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border overflow-hidden transition-shadow hover:shadow-lg">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center">
                  {category.icon && <span className="text-2xl mr-3">{category.icon}</span>}
                  <h2 className="text-xl font-semibold text-gray-800">{category.name_en}</h2>
                </div>
              </div>
              <div className="p-4">
                {/* This is where you might list sub-categories if you had them */}
                <p className="text-sm text-gray-500 mb-4">
                  Find the best products in the {category.name_en} category.
                </p>
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-center py-2 px-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <span>View Products</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Example of passing server data to a client component */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Featured Categories</h2>
          <Suspense fallback={<div className="text-center">Loading carousel...</div>}>
            <CategoryCarousel categories={categories} />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}
