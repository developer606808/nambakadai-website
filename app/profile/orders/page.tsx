
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define types for the order data
interface Product {
  name: string;
  images: string[];
}

interface OrderItem {
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

async function getOrders(): Promise<Order[]> {
  const url = new URL("/api/profile/orders", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch orders");
    return [];
  }
  return res.json();
}

export default async function MyOrdersPage() {
  const orders = await getOrders();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map(order => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold px-2 py-1 rounded-full text-sm ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</p>
                    <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.product.name} className="flex items-center">
                        <img src={item.product.images[0] || '/placeholder.svg'} alt={item.product.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>You have not placed any orders yet.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
