import Link from "next/link"
import { Search, Filter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SellerLayout from "@/components/seller/seller-layout"

export default function SellerOrdersPage() {
  // Mock order data
  const orders = [
    {
      id: "ORD-12345",
      customer: "John Doe",
      date: "2023-05-15",
      total: 78.5,
      status: "Delivered",
      items: 3,
      paymentStatus: "Paid",
    },
    {
      id: "ORD-12346",
      customer: "Jane Smith",
      date: "2023-06-22",
      total: 45.99,
      status: "Processing",
      items: 2,
      paymentStatus: "Paid",
    },
    {
      id: "ORD-12347",
      customer: "Robert Johnson",
      date: "2023-07-10",
      total: 120.75,
      status: "Shipped",
      items: 5,
      paymentStatus: "Paid",
    },
    {
      id: "ORD-12348",
      customer: "Emily Wilson",
      date: "2023-07-12",
      total: 35.25,
      status: "Pending",
      items: 1,
      paymentStatus: "Pending",
    },
    {
      id: "ORD-12349",
      customer: "Michael Brown",
      date: "2023-07-15",
      total: 92.8,
      status: "Processing",
      items: 4,
      paymentStatus: "Paid",
    },
  ]

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input type="text" placeholder="Search orders..." className="pr-10 w-full" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <select className="border rounded-md px-3 py-2 bg-white">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <select className="border rounded-md px-3 py-2 bg-white">
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Payment</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="flex items-center" asChild>
                      <Link href={`/seller/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1-5 of 5 orders</p>
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
