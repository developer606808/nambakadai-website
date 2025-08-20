import MainLayout from '@/components/main-layout';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

// Define types for the detailed store view
interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

interface StoreDetails {
  id: number;
  name: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  owner: { name: string; image: string | null; createdAt: string };
  products: Product[];
}

async function getStoreDetails(id: string): Promise<StoreDetails> {
  const url = new URL(`/api/stores/${id}`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const res = await fetch(url.toString(), { next: { revalidate: 600 } }); // Cache for 10 minutes
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch store details");
  }
  return res.json();
}

export default async function StoreDetailPage({ params }: { params: { id: string } }) {
  const store = await getStoreDetails(params.id);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Banner Image */}
        <div 
          className="h-48 md:h-64 bg-gray-200 rounded-lg mb-8 bg-cover bg-center"
          style={{ backgroundImage: `url(${store.bannerUrl || '/placeholder.svg'})` }}
        ></div>

        {/* Store Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
          <img 
            src={store.logoUrl || '/placeholder-logo.svg'} 
            alt={`${store.name} logo`} 
            className="w-32 h-32 rounded-full object-cover border-4 border-white -mt-20 md:-mt-24 mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold">{store.name}</h1>
            <p className="text-gray-600 mt-2">{store.description}</p>
          </div>
        </div>

        {/* Products Section */}
        <h2 className="text-2xl font-bold mb-6">Products from {store.name}</h2>
        {store.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {store.products.map((product) => (
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
                    <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                    <p className="text-xl font-bold text-green-600 mt-2">${product.price.toFixed(2)}</p>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p>This store has not listed any products yet.</p>
        )}
      </div>
    </MainLayout>
  );
}