import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define types for the seller order data
interface Product {
  name: string;
  images: string[];
}

interface OrderItem {
  quantity: number;
  product: Product;
}

interface Customer {
    name: string;
    email: string;
}

interface SellerOrder {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
  user: Customer;
}

async function getSellerOrders(): Promise<SellerOrder[]> {
  const url = new URL("/api/seller/orders", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch seller orders");
    return [];
  }
  return res.json();
}

export default async function SellerOrdersPage() {
  const orders = await getSellerOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Customer Orders</h1>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-500">Customer: {order.user.name} ({order.user.email})</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold px-2 py-1 rounded-full text-sm ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="my-4" />
                <p className="font-semibold mb-2">Order Items:</p>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.product.name} className="flex items-center text-sm">
                      <img src={item.product.images[0] || '/placeholder.svg'} alt={item.product.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                      <span>{item.product.name} (x{item.quantity})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>You have not received any orders yet.</p>
        )}
      </div>
    </div>
  );
}