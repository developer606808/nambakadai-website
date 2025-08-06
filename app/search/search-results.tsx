"use client"

import { useState, useEffect } from "react"
import { LazyImage } from "@/components/ui/lazy-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Store, Truck } from "lucide-react"
import Link from "next/link"
import WishlistButton from "@/components/wishlist/wishlist-button"

interface SearchResultsProps {
  query: string
  type: "all" | "products" | "stores" | "rentals"
  city?: string
}

export default function SearchResults({ query, type, city }: SearchResultsProps) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [rentals, setRentals] = useState<any[]>([])

  useEffect(() => {
    // Simulate API call with delay
    const timer = setTimeout(() => {
      // Mock data
      const mockProducts = Array.from({ length: 12 }, (_, i) => ({
        id: `p${i + 1}`,
        name: `${query ? query + " " : ""}Farm Fresh ${["Tomatoes", "Carrots", "Potatoes", "Apples", "Corn", "Lettuce"][i % 6]}`,
        price: Math.floor(Math.random() * 1000) + 100,
        image: `/placeholder.svg?height=200&width=200&text=Product+${i + 1}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 100),
        store: `Farm ${i + 1}`,
        storeId: `s${i + 1}`,
        organic: Math.random() > 0.5,
        freeShipping: Math.random() > 0.7,
        city: popularCities[Math.floor(Math.random() * popularCities.length)],
      }))

      const mockStores = Array.from({ length: 8 }, (_, i) => ({
        id: `s${i + 1}`,
        name: `${query ? query + " " : ""}${["Green", "Sunny", "Mountain", "Valley", "River", "Forest", "Meadow", "Ocean"][i]} Farm`,
        image: `/placeholder.svg?height=200&width=200&text=Store+${i + 1}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 100),
        products: Math.floor(Math.random() * 100) + 10,
        verified: Math.random() > 0.3,
        city: popularCities[Math.floor(Math.random() * popularCities.length)],
      }))

      const mockRentals = Array.from({ length: 6 }, (_, i) => ({
        id: `r${i + 1}`,
        name: `${query ? query + " " : ""}${["Tractor", "Harvester", "Plow", "Seeder", "Sprayer", "Combine"][i]}`,
        price: Math.floor(Math.random() * 10000) + 1000,
        image: `/placeholder.svg?height=200&width=200&text=Rental+${i + 1}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 50),
        store: `Equipment Rental ${i + 1}`,
        storeId: `s${i + 10}`,
        available: Math.random() > 0.2,
        city: popularCities[Math.floor(Math.random() * popularCities.length)],
      }))

      // Filter by city if provided
      const filteredProducts = city
        ? mockProducts.filter((p) => p.city.toLowerCase() === city.toLowerCase())
        : mockProducts

      const filteredStores = city ? mockStores.filter((s) => s.city.toLowerCase() === city.toLowerCase()) : mockStores

      const filteredRentals = city
        ? mockRentals.filter((r) => r.city.toLowerCase() === city.toLowerCase())
        : mockRentals

      setProducts(filteredProducts)
      setStores(filteredStores)
      setRentals(filteredRentals)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [query, type, city])

  if (loading) {
    return <LoadingResults type={type} />
  }

  return (
    <div>
      {type === "all" && (
        <>
          {products.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Products</h2>
                <Link
                  href={`/search?q=${query}&type=products${city ? `&city=${city}` : ""}`}
                  className="text-green-600 text-sm hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {stores.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Stores</h2>
                <Link
                  href={`/search?q=${query}&type=stores${city ? `&city=${city}` : ""}`}
                  className="text-green-600 text-sm hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stores.slice(0, 4).map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </div>
          )}

          {rentals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Rentals</h2>
                <Link
                  href={`/search?q=${query}&type=rentals${city ? `&city=${city}` : ""}`}
                  className="text-green-600 text-sm hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rentals.slice(0, 4).map((rental) => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            </div>
          )}

          {products.length === 0 && stores.length === 0 && rentals.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </>
      )}

      {type === "products" && (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </>
      )}

      {type === "stores" && (
        <>
          {stores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No stores found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </>
      )}

      {type === "rentals" && (
        <>
          {rentals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No rentals found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <LazyImage
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} productName={product.name} variant="icon" size="sm" />
        </div>
        {product.organic && <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Organic</Badge>}
      </div>
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {product.city}
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium line-clamp-2 group-hover:text-green-600 transition-colors mb-1">{product.name}</h3>
        </Link>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Store className="h-3 w-3 mr-1" />
          <Link href={`/stores/${product.storeId}`} className="hover:text-green-600 hover:underline">
            {product.store}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-semibold">¥{(product.price || 0).toFixed(2)}</div>
          {product.freeShipping && (
            <div className="flex items-center text-xs text-green-600">
              <Truck className="h-3 w-3 mr-1" />
              Free Shipping
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-green-500 hover:bg-green-600">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

function StoreCard({ store }: { store: any }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <Link href={`/stores/${store.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <LazyImage
            src={store.image}
            alt={store.name}
            width={300}
            height={300}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{store.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">({store.reviews})</span>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {store.city}
          </div>
        </div>
        <Link href={`/stores/${store.id}`}>
          <h3 className="font-medium line-clamp-2 group-hover:text-green-600 transition-colors mb-1">{store.name}</h3>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500">{store.products} Products</div>
          {store.verified && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Verified
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
          <Link href={`/stores/${store.id}`}>Visit Store</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function RentalCard({ rental }: { rental: any }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <div className="relative">
        <Link href={`/rentals/${rental.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <LazyImage
              src={rental.image}
              alt={rental.name}
              width={300}
              height={300}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <WishlistButton productId={rental.id} productName={rental.name} variant="icon" size="sm" />
        </div>
        {rental.available ? (
          <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Available</Badge>
        ) : (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Unavailable</Badge>
        )}
      </div>
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rental.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">({rental.reviews})</span>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {rental.city}
          </div>
        </div>
        <Link href={`/rentals/${rental.id}`}>
          <h3 className="font-medium line-clamp-2 group-hover:text-green-600 transition-colors mb-1">{rental.name}</h3>
        </Link>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Store className="h-3 w-3 mr-1" />
          <Link href={`/stores/${rental.storeId}`} className="hover:text-green-600 hover:underline">
            {rental.store}
          </Link>
        </div>
        <div className="font-semibold">¥{(rental.price || 0).toLocaleString()} / day</div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
          <Link href={`/rentals/${rental.id}/request`}>Request Rental</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function LoadingResults({ type }: { type: string }) {
  const count = type === "all" ? 4 : 12
  return (
    <div>
      {type === "all" && (
        <>
          <div className="mb-10">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          </div>
          <div className="mb-10">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          </div>
        </>
      )}

      {type !== "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingCard() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse"></div>
      <CardContent className="pt-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
      </CardFooter>
    </Card>
  )
}

// List of popular cities for the mock data
const popularCities = [
  "Tokyo",
  "Osaka",
  "Yokohama",
  "Nagoya",
  "Sapporo",
  "Fukuoka",
  "Kyoto",
  "Kobe",
  "Kawasaki",
  "Saitama",
  "Hiroshima",
  "Sendai",
  "Chiba",
  "Kitakyushu",
  "Sakai",
  "Niigata",
  "Hamamatsu",
  "Kumamoto",
  "Sagamihara",
  "Okayama",
]
