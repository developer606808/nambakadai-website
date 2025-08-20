import Link from 'next/link';
import MainLayout from '@/components/main-layout';
import Breadcrumbs from '@/components/breadcrumbs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { notFound } from 'next/navigation';

// Define types for our data structures
interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: {
    name_en: string;
    slug: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

interface ProductsApiResponse {
  data: Product[];
  pagination: Pagination;
}

// The page component is a Server Component
async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductsApiResponse> {
  const url = new URL("/api/products", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  // Append search params to the fetch URL
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    cache: 'no-store', // Products data changes often, so we don't cache
  });

  if (!res.ok) {
    // If the API returns a 404 or other error, show the not-found page
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { data: products, pagination } = await getProducts(searchParams);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        
        {/* TODO: Add client component for filtering */}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <Link href={`/products/${product.id}`}>
                  <CardContent className="p-0">
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <p className="text-sm text-gray-500">{product.category.name_en}</p>
                    <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                    <p className="text-xl font-bold text-green-600 mt-2">${product.price.toFixed(2)}</p>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Products Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}

        {/* TODO: Add client component for pagination controls */}
      </div>
    </MainLayout>
  );
}