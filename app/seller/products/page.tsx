import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// Define a type for the seller's product
interface SellerProduct {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  // Add other fields as needed
}

async function getSellerProducts(): Promise<SellerProduct[]> {
  const url = new URL("/api/seller/products", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  // This fetch needs to be authenticated. The browser's cookies will be sent automatically.
  // For server-to-server requests, you would need to forward the auth token.
  const res = await fetch(url.toString(), {
    cache: 'no-store', // Always fetch fresh data for the seller dashboard
  });

  if (!res.ok) {
    // Handle errors, maybe show a message to the user
    console.error("Failed to fetch seller products, status:", res.status);
    return [];
  }

  return res.json();
}

export default async function SellerProductsPage() {
  const products = await getSellerProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Your Products</h1>
        <Button asChild>
          <Link href="/seller/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>
      
      {/* You would typically use a <DataTable> component here */}
      <div className="bg-white rounded-lg border p-4">
        {products.length > 0 ? (
          <ul>
            {products.map(product => (
              <li key={product.id} className="flex justify-between items-center p-2 border-b">
                <span>{product.name}</span>
                <span>${product.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">You haven't added any products yet.</p>
        )}
      </div>
    </div>
  )
}