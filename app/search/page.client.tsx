"use client"

import { Filter, Grid3X3, List, MapPin, X } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchResults from "./search-results"
import { LocationFilter } from "@/components/location-filter"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Popular cities across Japan
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

export default function SearchPageClient({ searchParams }: { searchParams: { q?: string; city?: string } }) {
  const query = searchParams.q || ""
  const selectedCity = searchParams.city || ""

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
          <p className="text-gray-600">Found 156 results matching your search</p>
        </div>

        {/* City Selection */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">City:</span>
          </div>

          <div className="w-full sm:w-64">
            <Select defaultValue={selectedCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Popular Cities</SelectLabel>
                  <SelectItem value="all">All Cities</SelectItem>
                  {popularCities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedCity && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center h-8 px-2 text-xs"
              onClick={() => {
                // Clear city filter logic would go here
                console.log("Clear city filter")
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <SearchFilters />
          </div>

          {/* Filters - Mobile */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <SearchFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded-md text-sm p-1">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Rating</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="rounded-r-none border-r">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="stores">Stores</TabsTrigger>
                <TabsTrigger value="rentals">Rentals</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <LazyLoadWrapper>
                  <SearchResults query={query} type="all" city={selectedCity} />
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="products">
                <LazyLoadWrapper>
                  <SearchResults query={query} type="products" city={selectedCity} />
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="stores">
                <LazyLoadWrapper>
                  <SearchResults query={query} type="stores" city={selectedCity} />
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="rentals">
                <LazyLoadWrapper>
                  <SearchResults query={query} type="rentals" city={selectedCity} />
                </LazyLoadWrapper>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function SearchFilters() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-gray-900">
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>

        {/* Location Filter */}
        <div className="border-t pt-4 mb-4">
          <LocationFilter
            onFilterChange={(locations) => {
              console.log("Location filter changed:", locations)
              // Handle filter change
            }}
          />
        </div>

        {/* Categories */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {["Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Equipment", "Tools"].map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox id={`category-${category}`} />
                <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
          <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-green-600">
            Show more
          </Button>
        </div>

        {/* Price Range */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">Price Range</h4>
          <div className="px-2">
            <Slider defaultValue={[0, 1000]} min={0} max={5000} step={100} />
            <div className="flex items-center justify-between mt-4">
              <div className="w-20">
                <Input type="number" placeholder="Min" className="h-8" />
              </div>
              <span className="text-gray-500">-</span>
              <div className="w-20">
                <Input type="number" placeholder="Max" className="h-8" />
              </div>
              <Button size="sm" className="ml-2 bg-green-500 hover:bg-green-600 h-8">
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Rating</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <Checkbox id={`rating-${rating}`} />
                <label htmlFor={`rating-${rating}`} className="ml-2 text-sm flex items-center">
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  {Array(5 - rating)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Availability</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="in-stock" />
              <label htmlFor="in-stock" className="ml-2 text-sm">
                In Stock
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="available-for-rent" />
              <label htmlFor="available-for-rent" className="ml-2 text-sm">
                Available for Rent
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="organic" />
              <label htmlFor="organic" className="ml-2 text-sm">
                Organic
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="free-shipping" />
              <label htmlFor="free-shipping" className="ml-2 text-sm">
                Free Shipping
              </label>
            </div>
          </div>
        </div>

        {/* Apply Filters Button - Mobile Only */}
        <div className="lg:hidden pt-4 border-t">
          <Button className="w-full bg-green-500 hover:bg-green-600">Apply Filters</Button>
        </div>
      </div>
    </div>
  )
}
