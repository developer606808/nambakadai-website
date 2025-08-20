import Link from 'next/link';
import MainLayout from '@/components/main-layout';
import { Card, CardContent } from '@/components/ui/card';

interface Store {
  id: number;
  name: string;
  description: string;
  logoUrl: string | null;
  owner: { name: string };
}

async function getStores(): Promise<Store[]> {
  const url = new URL("/api/stores", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
}

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Explore Our Stores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link key={store.id} href={`/stores/${store.id}`}>
              <Card className="overflow-hidden group h-full">
                <CardContent className="p-6 text-center">
                  <img 
                    src={store.logoUrl || '/placeholder-logo.svg'} 
                    alt={`${store.name} logo`} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border"
                  />
                  <h2 className="text-xl font-semibold group-hover:text-green-600">{store.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Operated by {store.owner.name}</p>
                  <p className="text-gray-600 mt-4 text-sm">{store.description.substring(0, 100)}...</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}