import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SellerLayout from "@/components/seller/seller-layout"

export default function SellerProductsPage() {
  // Mock product data
  const products = [
    {
      id: "1",
      name: "Organic Apples",
      image: "/placeholder.svg?height=100&width=100",
      price: 3.99,
      inventory: 45,
      category: "Fruits",
      status: "Active",
    },
    {
      id: "2",
      name: "Fresh Strawberries",
      image: "/placeholder.svg?height=100&width=100",
      price: 4.5,
      inventory: 32,
      category: "Fruits",
      status: "Active",
    },
    {
      id: "3",
      name: "Heirloom Tomatoes",
      image: "/placeholder.svg?height=100&width=100",
      price: 5.99,
      inventory: 0,
      category: "Vegetables",
      status: "Out of Stock",
    },
    {
      id: "4",
      name: "Organic Honey",
      image: "/placeholder.svg?height=100&width=100",
      price: 8.99,
      inventory: 15,
      category: "Pantry",
      status: "Active",
    },
    {
      id: "5",
      name: "Farm Fresh Eggs",
      image: "/placeholder.svg?height=100&width=100",
      price: 6.99,
      inventory: 24,
      category: "Dairy",
      status: "Active",
    },
  ]

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button className="bg-green-500 hover:bg-green-600" asChild>
          <Link href="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input type="text" placeholder="Search products..." className="pr-10 w-full" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <select className="border rounded-md px-3 py-2 bg-white">
                <option>All Categories</option>
                <option>Fruits</option>
                <option>Vegetables</option>
                <option>Dairy</option>
                <option>Pantry</option>
              </select>
              <select className="border rounded-md px-3 py-2 bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Out of Stock</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Inventory</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 mr-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-right font-medium">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    {product.inventory > 0 ? product.inventory : <span className="text-red-500">Out of stock</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/seller/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1-5 of 5 products</p>
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
