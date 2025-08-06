"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight, ChevronLeft, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"

export default function Home() {
  // Mock data for products (expand to 30+ items)
  const mockProducts = [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Organic Apples",
      price: 3.99,
      unit: "per pound",
      rating: 4.5,
      reviews: 128,
      location: "Oakland, CA",
      seller: "Green Valley Farms",
      sellerId: "1",
      isOrganic: true,
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=200",
      title: "Heirloom Tomatoes",
      price: 4.99,
      unit: "per lb",
      rating: 4.7,
      reviews: 86,
      location: "Berkeley, CA",
      seller: "Miller's Garden",
      sellerId: "2",
      isBestSeller: true,
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Strawberries",
      price: 5.99,
      unit: "per box",
      rating: 4.8,
      reviews: 152,
      location: "Santa Cruz, CA",
      seller: "Berry Farm",
      sellerId: "3",
      isOrganic: true,
      isBestSeller: true,
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Farm Eggs",
      price: 6.99,
      unit: "per dozen",
      rating: 4.9,
      reviews: 210,
      location: "Palo Alto, CA",
      seller: "Happy Hens Farm",
      sellerId: "4",
      isOrganic: true,
    },
    {
      id: 5,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Carrots",
      price: 2.99,
      unit: "per bunch",
      rating: 4.6,
      reviews: 95,
      location: "San Jose, CA",
      seller: "Root Vegetables Co",
      sellerId: "5",
      isOrganic: true,
    },
    {
      id: 6,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Spinach",
      price: 3.49,
      unit: "per bag",
      rating: 4.4,
      reviews: 73,
      location: "Fremont, CA",
      seller: "Leafy Greens Farm",
      sellerId: "6",
      isOrganic: true,
    },
    {
      id: 7,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Broccoli",
      price: 4.29,
      unit: "per head",
      rating: 4.7,
      reviews: 112,
      location: "Sunnyvale, CA",
      seller: "Green Veggie Co",
      sellerId: "7",
      isOrganic: true,
    },
    {
      id: 8,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Corn",
      price: 1.99,
      unit: "per ear",
      rating: 4.5,
      reviews: 88,
      location: "Mountain View, CA",
      seller: "Corn Fields Farm",
      sellerId: "8",
    },
    {
      id: 9,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Bell Peppers",
      price: 5.49,
      unit: "per pack",
      rating: 4.6,
      reviews: 67,
      location: "Cupertino, CA",
      seller: "Pepper Paradise",
      sellerId: "9",
      isOrganic: true,
    },
    {
      id: 10,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Lettuce",
      price: 2.79,
      unit: "per head",
      rating: 4.3,
      reviews: 54,
      location: "Santa Clara, CA",
      seller: "Crisp Greens",
      sellerId: "10",
    },
    {
      id: 11,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Potatoes",
      price: 3.99,
      unit: "per 3lb bag",
      rating: 4.8,
      reviews: 134,
      location: "San Mateo, CA",
      seller: "Potato Paradise",
      sellerId: "11",
      isOrganic: true,
    },
    {
      id: 12,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Onions",
      price: 2.49,
      unit: "per 2lb bag",
      rating: 4.4,
      reviews: 76,
      location: "Redwood City, CA",
      seller: "Onion Valley",
      sellerId: "12",
    },
    {
      id: 13,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Cucumbers",
      price: 3.29,
      unit: "per pack",
      rating: 4.5,
      reviews: 89,
      location: "Foster City, CA",
      seller: "Cool Cucumber Co",
      sellerId: "13",
      isOrganic: true,
    },
    {
      id: 14,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Zucchini",
      price: 2.99,
      unit: "per lb",
      rating: 4.2,
      reviews: 45,
      location: "Belmont, CA",
      seller: "Squash Squad",
      sellerId: "14",
    },
    {
      id: 15,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Kale",
      price: 4.49,
      unit: "per bunch",
      rating: 4.7,
      reviews: 98,
      location: "San Carlos, CA",
      seller: "Super Greens",
      sellerId: "15",
      isOrganic: true,
    },
    {
      id: 16,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Mushrooms",
      price: 5.99,
      unit: "per 8oz pack",
      rating: 4.6,
      reviews: 112,
      location: "Menlo Park, CA",
      seller: "Fungi Farm",
      sellerId: "16",
    },
    {
      id: 17,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Avocados",
      price: 7.99,
      unit: "per 4-pack",
      rating: 4.8,
      reviews: 156,
      location: "Atherton, CA",
      seller: "Avocado Grove",
      sellerId: "17",
      isOrganic: true,
      isBestSeller: true,
    },
    {
      id: 18,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Lemons",
      price: 3.99,
      unit: "per 2lb bag",
      rating: 4.5,
      reviews: 87,
      location: "Portola Valley, CA",
      seller: "Citrus Central",
      sellerId: "18",
    },
    {
      id: 19,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Oranges",
      price: 4.99,
      unit: "per 3lb bag",
      rating: 4.7,
      reviews: 123,
      location: "Woodside, CA",
      seller: "Orange Orchard",
      sellerId: "19",
      isOrganic: true,
    },
    {
      id: 20,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Bananas",
      price: 2.49,
      unit: "per bunch",
      rating: 4.3,
      reviews: 67,
      location: "Los Altos, CA",
      seller: "Tropical Fruits",
      sellerId: "20",
    },
    {
      id: 21,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Grapes",
      price: 6.99,
      unit: "per 2lb bag",
      rating: 4.8,
      reviews: 145,
      location: "Los Altos Hills, CA",
      seller: "Vineyard Fresh",
      sellerId: "21",
      isOrganic: true,
    },
    {
      id: 22,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Pears",
      price: 4.49,
      unit: "per 2lb bag",
      rating: 4.4,
      reviews: 78,
      location: "Saratoga, CA",
      seller: "Pear Paradise",
      sellerId: "22",
    },
    {
      id: 23,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Blueberries",
      price: 8.99,
      unit: "per pint",
      rating: 4.9,
      reviews: 189,
      location: "Campbell, CA",
      seller: "Berry Bliss",
      sellerId: "23",
      isOrganic: true,
      isBestSeller: true,
    },
    {
      id: 24,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Peaches",
      price: 5.49,
      unit: "per 2lb bag",
      rating: 4.6,
      reviews: 92,
      location: "Los Gatos, CA",
      seller: "Peach Perfect",
      sellerId: "24",
    },
    {
      id: 25,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Cherries",
      price: 9.99,
      unit: "per lb",
      rating: 4.8,
      reviews: 167,
      location: "Monte Sereno, CA",
      seller: "Cherry Hill Farm",
      sellerId: "25",
      isOrganic: true,
      isBestSeller: true,
    },
    {
      id: 26,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Plums",
      price: 4.99,
      unit: "per 2lb bag",
      rating: 4.5,
      reviews: 83,
      location: "Milpitas, CA",
      seller: "Plum Grove",
      sellerId: "26",
    },
    {
      id: 27,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Apricots",
      price: 6.49,
      unit: "per lb",
      rating: 4.7,
      reviews: 104,
      location: "Gilroy, CA",
      seller: "Apricot Acres",
      sellerId: "27",
      isOrganic: true,
    },
    {
      id: 28,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Watermelon",
      price: 7.99,
      unit: "per whole",
      rating: 4.6,
      reviews: 115,
      location: "Morgan Hill, CA",
      seller: "Melon Mania",
      sellerId: "28",
    },
    {
      id: 29,
      image: "/placeholder.svg?height=200&width=200",
      title: "Organic Cantaloupe",
      price: 5.99,
      unit: "per whole",
      rating: 4.4,
      reviews: 71,
      location: "San Martin, CA",
      seller: "Sweet Melons",
      sellerId: "29",
      isOrganic: true,
    },
    {
      id: 30,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fresh Pineapple",
      price: 4.99,
      unit: "per whole",
      rating: 4.7,
      reviews: 128,
      location: "Hollister, CA",
      seller: "Tropical Paradise",
      sellerId: "30",
    },
  ]

  // Mock data for rentals (expand to 30+ items)
  const mockRentals = [
    {
      id: 1,
      image: "/placeholder.svg?height=200&width=200",
      title: "Farm Tractor - John Deere",
      price: 150,
      unit: "per day",
      rating: 4.5,
      reviews: 32,
      location: "San Jose, CA",
      availability: 12,
      category: "Heavy Equipment",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=200&width=200",
      title: "Pickup Truck - Ford F-150",
      price: 85,
      unit: "per day",
      rating: 4.7,
      reviews: 45,
      location: "Oakland, CA",
      availability: 20,
      category: "Trucks",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=200&width=200",
      title: "Delivery Van - Transit",
      price: 95,
      unit: "per day",
      rating: 4.6,
      reviews: 38,
      location: "San Francisco, CA",
      availability: 15,
      category: "Vans",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=200&width=200",
      title: "Compact Tractor - Kubota",
      price: 120,
      unit: "per day",
      rating: 4.8,
      reviews: 28,
      location: "Fremont, CA",
      availability: 8,
      category: "Heavy Equipment",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=200&width=200",
      title: "Cargo Trailer - 16ft",
      price: 65,
      unit: "per day",
      rating: 4.4,
      reviews: 52,
      location: "Berkeley, CA",
      availability: 25,
      category: "Trailers",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=200&width=200",
      title: "Box Truck - Isuzu",
      price: 110,
      unit: "per day",
      rating: 4.5,
      reviews: 41,
      location: "Santa Clara, CA",
      availability: 18,
      category: "Trucks",
    },
    {
      id: 7,
      image: "/placeholder.svg?height=200&width=200",
      title: "Utility ATV - Polaris",
      price: 75,
      unit: "per day",
      rating: 4.6,
      reviews: 35,
      location: "Sunnyvale, CA",
      availability: 14,
      category: "ATVs",
    },
    {
      id: 8,
      image: "/placeholder.svg?height=200&width=200",
      title: "Flatbed Truck - Chevy",
      price: 125,
      unit: "per day",
      rating: 4.7,
      reviews: 29,
      location: "Mountain View, CA",
      availability: 11,
      category: "Trucks",
    },
    {
      id: 9,
      image: "/placeholder.svg?height=200&width=200",
      title: "Mini Excavator - CAT",
      price: 200,
      unit: "per day",
      rating: 4.9,
      reviews: 22,
      location: "Palo Alto, CA",
      availability: 6,
      category: "Heavy Equipment",
    },
    {
      id: 10,
      image: "/placeholder.svg?height=200&width=200",
      title: "Dump Truck - Mack",
      price: 180,
      unit: "per day",
      rating: 4.5,
      reviews: 33,
      location: "Cupertino, CA",
      availability: 9,
      category: "Trucks",
    },
    {
      id: 11,
      image: "/placeholder.svg?height=200&width=200",
      title: "Skid Steer - Bobcat",
      price: 140,
      unit: "per day",
      rating: 4.8,
      reviews: 26,
      location: "San Mateo, CA",
      availability: 13,
      category: "Heavy Equipment",
    },
    {
      id: 12,
      image: "/placeholder.svg?height=200&width=200",
      title: "Refrigerated Van",
      price: 130,
      unit: "per day",
      rating: 4.6,
      reviews: 37,
      location: "Redwood City, CA",
      availability: 16,
      category: "Vans",
    },
    {
      id: 13,
      image: "/placeholder.svg?height=200&width=200",
      title: "Farm Utility Vehicle",
      price: 90,
      unit: "per day",
      rating: 4.4,
      reviews: 44,
      location: "Foster City, CA",
      availability: 21,
      category: "Utility Vehicles",
    },
    {
      id: 14,
      image: "/placeholder.svg?height=200&width=200",
      title: "Livestock Trailer",
      price: 85,
      unit: "per day",
      rating: 4.7,
      reviews: 31,
      location: "Belmont, CA",
      availability: 12,
      category: "Trailers",
    },
    {
      id: 15,
      image: "/placeholder.svg?height=200&width=200",
      title: "Hay Baler - New Holland",
      price: 160,
      unit: "per day",
      rating: 4.8,
      reviews: 19,
      location: "San Carlos, CA",
      availability: 7,
      category: "Farm Equipment",
    },
    {
      id: 16,
      image: "/placeholder.svg?height=200&width=200",
      title: "Mower - Zero Turn",
      price: 70,
      unit: "per day",
      rating: 4.5,
      reviews: 48,
      location: "Menlo Park, CA",
      availability: 23,
      category: "Lawn Equipment",
    },
    {
      id: 17,
      image: "/placeholder.svg?height=200&width=200",
      title: "Sprayer - Field",
      price: 110,
      unit: "per day",
      rating: 4.6,
      reviews: 27,
      location: "Atherton, CA",
      availability: 10,
      category: "Farm Equipment",
    },
    {
      id: 18,
      image: "/placeholder.svg?height=200&width=200",
      title: "Cultivator - Disc",
      price: 95,
      unit: "per day",
      rating: 4.4,
      reviews: 34,
      location: "Portola Valley, CA",
      availability: 15,
      category: "Farm Equipment",
    },
    {
      id: 19,
      image: "/placeholder.svg?height=200&width=200",
      title: "Seeder - Precision",
      price: 135,
      unit: "per day",
      rating: 4.7,
      reviews: 24,
      location: "Woodside, CA",
      availability: 8,
      category: "Farm Equipment",
    },
    {
      id: 20,
      image: "/placeholder.svg?height=200&width=200",
      title: "Harvester - Combine",
      price: 250,
      unit: "per day",
      rating: 4.9,
      reviews: 16,
      location: "Los Altos, CA",
      availability: 4,
      category: "Heavy Equipment",
    },
    {
      id: 21,
      image: "/placeholder.svg?height=200&width=200",
      title: "Plow - Moldboard",
      price: 80,
      unit: "per day",
      rating: 4.3,
      reviews: 39,
      location: "Los Altos Hills, CA",
      availability: 17,
      category: "Farm Equipment",
    },
    {
      id: 22,
      image: "/placeholder.svg?height=200&width=200",
      title: "Harrow - Disc",
      price: 75,
      unit: "per day",
      rating: 4.5,
      reviews: 42,
      location: "Saratoga, CA",
      availability: 19,
      category: "Farm Equipment",
    },
    {
      id: 23,
      image: "/placeholder.svg?height=200&width=200",
      title: "Manure Spreader",
      price: 100,
      unit: "per day",
      rating: 4.4,
      reviews: 30,
      location: "Campbell, CA",
      availability: 14,
      category: "Farm Equipment",
    },
    {
      id: 24,
      image: "/placeholder.svg?height=200&width=200",
      title: "Irrigation System - Mobile",
      price: 120,
      unit: "per day",
      rating: 4.8,
      reviews: 25,
      location: "Los Gatos, CA",
      availability: 11,
      category: "Irrigation",
    },
    {
      id: 25,
      image: "/placeholder.svg?height=200&width=200",
      title: "Greenhouse Trailer",
      price: 90,
      unit: "per day",
      rating: 4.6,
      reviews: 36,
      location: "Monte Sereno, CA",
      availability: 13,
      category: "Specialty",
    },
    {
      id: 26,
      image: "/placeholder.svg?height=200&width=200",
      title: "Soil Aerator",
      price: 65,
      unit: "per day",
      rating: 4.3,
      reviews: 47,
      location: "Milpitas, CA",
      availability: 22,
      category: "Lawn Equipment",
    },
    {
      id: 27,
      image: "/placeholder.svg?height=200&width=200",
      title: "Fertilizer Spreader",
      price: 55,
      unit: "per day",
      rating: 4.4,
      reviews: 51,
      location: "Gilroy, CA",
      availability: 26,
      category: "Farm Equipment",
    },
    {
      id: 28,
      image: "/placeholder.svg?height=200&width=200",
      title: "Post Hole Digger",
      price: 45,
      unit: "per day",
      rating: 4.2,
      reviews: 58,
      location: "Morgan Hill, CA",
      availability: 28,
      category: "Tools",
    },
    {
      id: 29,
      image: "/placeholder.svg?height=200&width=200",
      title: "Brush Cutter",
      price: 60,
      unit: "per day",
      rating: 4.5,
      reviews: 43,
      location: "San Martin, CA",
      availability: 20,
      category: "Lawn Equipment",
    },
    {
      id: 30,
      image: "/placeholder.svg?height=200&width=200",
      title: "Wood Chipper",
      price: 85,
      unit: "per day",
      rating: 4.6,
      reviews: 32,
      location: "Hollister, CA",
      availability: 16,
      category: "Tools",
    },
  ]
  const [selectedType, setSelectedType] = useState<"products" | "rentals">("products")
  const [displayedProducts, setDisplayedProducts] = useState(mockProducts.slice(0, 20))
  const [displayedRentals, setDisplayedRentals] = useState(mockRentals.slice(0, 20))
  const [hasMoreProducts, setHasMoreProducts] = useState(mockProducts.length > 20)
  const [hasMoreRentals, setHasMoreRentals] = useState(mockRentals.length > 20)
  const [loading, setLoading] = useState(false)

  const loadMore = () => {
    setLoading(true)
    setTimeout(() => {
      if (selectedType === "products") {
        const currentLength = displayedProducts.length
        const newProducts = mockProducts.slice(currentLength, currentLength + 20)
        setDisplayedProducts((prev) => [...prev, ...newProducts])
        setHasMoreProducts(currentLength + 20 < mockProducts.length)
      } else {
        const currentLength = displayedRentals.length
        const newRentals = mockRentals.slice(currentLength, currentLength + 20)
        setDisplayedRentals((prev) => [...prev, ...newRentals])
        setHasMoreRentals(currentLength + 20 < mockRentals.length)
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f9fcf7] relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="bg-pattern"></div>
        </div>
        {/* Hero Section */}
        <section className="relative bg-[#f0f9ed] py-16 px-4 md:px-6 lg:px-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="leaf leaf-1"></div>
            <div className="leaf leaf-2"></div>
            <div className="leaf leaf-3"></div>
            <div className="leaf leaf-4"></div>
            <div className="leaf leaf-5"></div>
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Fresh From Farm <span className="text-black">to</span> <span className="text-green-600">Your Table</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect directly with local farmers, vendors, or sell your own products in our sustainable marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                Learn More
              </Button>
            </div>
            <div className="max-w-xl mx-auto relative">
              <Input
                className="pl-4 pr-12 py-2 rounded-md w-full"
                placeholder="Search for products, stores, or vendors..."
              />
              <Button className="absolute right-0 top-0 bottom-0 bg-green-500 hover:bg-green-600 rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Seasonal Produce Carousel */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="absolute inset-0 z-5">
              <div className="growing-plant growing-plant-1"></div>
              <div className="growing-plant growing-plant-2"></div>
              <div className="growing-plant growing-plant-3"></div>
            </div>
            <Image
              src="/placeholder.svg?height=400&width=1200"
              alt="Fresh Seasonal Produce"
              width={1200}
              height={400}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-8 z-20">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Fresh Seasonal Produce</h2>
              <p className="text-white/90 mb-4">Discover fruits and vegetables sourced from local farms</p>
              <Button className="bg-green-500 hover:bg-green-600 w-fit">Explore Now</Button>
            </div>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30">
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </section>

        {/* Browse Categories */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Browse Categories</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <CategoryItem icon="🍎" label="Fruits" bgColor="bg-red-50" category="fruits" />
            <CategoryItem icon="🥦" label="Vegetables" bgColor="bg-green-50" category="vegetables" />
            <CategoryItem icon="🌱" label="Organic Produce" bgColor="bg-emerald-50" category="organic" />
            <CategoryItem icon="🌾" label="Plants" bgColor="bg-teal-50" category="plants" />
            <CategoryItem icon="🍯" label="Milk" bgColor="bg-yellow-50" category="dairy" />
            <CategoryItem icon="🌽" label="Grains" bgColor="bg-amber-50" category="grains" />
            <CategoryItem icon="🌰" label="Seeds" bgColor="bg-orange-50" category="seeds" />
            <CategoryItem icon="🥛" label="Dairy Products" bgColor="bg-blue-50" category="dairy" />
            <CategoryItem icon="🍲" label="Homemade" bgColor="bg-rose-50" category="homemade" />
            <CategoryItem icon="🧶" label="Handmade" bgColor="bg-purple-50" category="handmade" />
            <CategoryItem icon="🍂" label="Seasonal Foods" bgColor="bg-amber-50" category="seasonal" />
            <CategoryItem icon="🎁" label="Free Items" bgColor="bg-indigo-50" category="free" />
            <CategoryItem icon="📚" label="Books" bgColor="bg-sky-50" category="books" />
            <CategoryItem icon="💐" label="Flowers" bgColor="bg-pink-50" category="flowers" />
            <CategoryItem icon="🧪" label="Fertilizers" bgColor="bg-brown-50" category="fertilizers" />
            <CategoryItem icon="🦠" label="Biofertilizers" bgColor="bg-lime-50" category="biofertilizers" />
            <CategoryItem icon="🚜" label="Farming Machines" bgColor="bg-cyan-50" category="machines" />
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Plus className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">View All</span>
            </div>
          </div>
        </section>

        {/* Featured Products/Rentals */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Featured Items</h2>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "products" | "rentals")}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
              >
                <option value="products">Store Products</option>
                <option value="rentals">Rental Vehicles</option>
              </select>
            </div>
            <Link
              href={selectedType === "products" ? "/products" : "/rentals"}
              className="text-sm text-green-600 hover:underline flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedType === "products"
              ? displayedProducts.map((product) => <ProductCard key={product.id} {...product} />)
              : displayedRentals.map((rental) => <RentalCard key={rental.id} {...rental} />)}
          </div>
          {(selectedType === "products" ? hasMoreProducts : hasMoreRentals) && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMore} disabled={loading} className="bg-green-500 hover:bg-green-600">
                {loading ? "Loading..." : "Show More"}
              </Button>
            </div>
          )}
        </section>

        {/* Sell on Platform */}
        <section className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-[#f0f9ed] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {/* Animated farm background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="farm-pattern"></div>
              <div className="floating-seed floating-seed-1"></div>
              <div className="floating-seed floating-seed-2"></div>
              <div className="floating-seed floating-seed-3"></div>
            </div>

            <div className="md:w-1/2 z-10">
              <h2 className="text-2xl font-bold mb-4">Start Selling on Nanbakadai</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of farmers and vendors who have found success in our marketplace. Our simple platform
                makes it easy to start selling today.
              </p>
              <Link href="/seller/register">
                <Button className="bg-green-500 hover:bg-green-600 flex items-center">
                  Create Your Store <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center z-10">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Selling on Nanbakadai"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Popular Stores */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Popular Stores</h2>
            <Link href="/stores" className="text-sm text-green-600 hover:underline flex items-center">
              View All Stores <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StoreCard
              id="1"
              image="/placeholder.svg?height=150&width=300"
              name="Green Valley Farm"
              category="Organic Produce"
              rating={4.8}
              reviews={67}
            />
            <StoreCard
              id="2"
              image="/placeholder.svg?height=150&width=300"
              name="Happy Hens"
              category="Poultry & Eggs"
              rating={4.7}
              reviews={43}
            />
            <StoreCard
              id="3"
              image="/placeholder.svg?height=150&width=300"
              name="Fresh Greens"
              category="Vegetables"
              rating={4.9}
              reviews={81}
            />
            <StoreCard
              id="4"
              image="/placeholder.svg?height=150&width=300"
              name="Berry Hill Farm"
              category="Fruits & Berries"
              rating={4.6}
              reviews={54}
            />
          </div>
        </section>

        {/* Rent Vehicles */}
        <section className="py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Rent Vehicles</h2>
            <Link href="/rentals" className="text-sm text-green-600 hover:underline flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <p className="text-gray-600 mb-6">Rent vehicles to help with your farming and transport needs.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VehicleCard
              image="/placeholder.svg?height=200&width=300"
              title="Farm Tractor"
              price={120}
              unit="per day"
              rating={4.5}
              reviews={32}
              location="San Jose, CA"
              availability={12}
            />
            <VehicleCard
              image="/placeholder.svg?height=200&width=300"
              title="Pickup Truck"
              price={85}
              unit="per day"
              rating={4.7}
              reviews={45}
              location="Oakland, CA"
              availability={20}
            />
            <VehicleCard
              image="/placeholder.svg?height=200&width=300"
              title="Delivery Van"
              price={95}
              unit="per day"
              rating={4.6}
              reviews={38}
              location="San Francisco, CA"
              availability={15}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="floating-particle floating-particle-1"></div>
            <div className="floating-particle floating-particle-2"></div>
            <div className="floating-particle floating-particle-3"></div>
            <div className="floating-particle floating-particle-4"></div>
            <div className="floating-particle floating-particle-5"></div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 relative z-10">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-8 relative z-10">
            Join thousands of satisfied customers who buy, sell, and rent on our platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Emily Johnson"
              role="Local Customer"
              quote="I love buying fresh produce directly from local farmers. The quality is amazing and I know exactly where my food comes from."
            />
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Michael Chang"
              role="Farm Owner"
              quote="Setting up my store on Nanbakadai was incredibly easy. Now I can sell directly to customers and avoid the middleman."
            />
            <TestimonialCard
              avatar="/placeholder.svg?height=60&width=60"
              name="Sarah Wilson"
              role="Organic Gardener"
              quote="Being able to rent farming equipment when I need it has been a game changer for my small garden project."
            />
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

// Component for category items
function CategoryItem({
  icon,
  label,
  bgColor,
  category,
}: { icon: string; label: string; bgColor: string; category: string }) {
  return (
    <Link href={`/categories/${category}`}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
          <span className="text-lg">{icon}</span>
        </div>
        <span className="text-xs text-center">{label}</span>
      </div>
    </Link>
  )
}

// Component for product cards
function ProductCard({
  id,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  seller,
  sellerId,
  isOrganic,
  isBestSeller,
  isRental,
}: {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  seller: string
  sellerId: string
  isOrganic?: boolean
  isBestSeller?: boolean
  isRental?: boolean
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {isOrganic && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Organic</div>
        )}
        {isBestSeller && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">Best Seller</div>
        )}
        {isRental && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Rental</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <div>📍 {location}</div>
          <div>
            Seller:{" "}
            <Link href={`/stores/${sellerId}`} className="text-green-600 hover:underline">
              {seller}
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
            <Link href={`/products/${id}`}>More Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50" asChild>
            <Link href={`/stores/${sellerId}`}>Visit Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component for store cards
function StoreCard({
  id,
  image,
  name,
  category,
  rating,
  reviews,
}: { id: string; image: string; name: string; category: string; rating: number; reviews: number }) {
  return (
    <Link href={`/stores/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-32">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{category}</p>
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs ml-1">{rating}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">({reviews} reviews)</span>
          </div>
          <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
            Visit Store
          </Button>
        </div>
      </div>
    </Link>
  )
}

// Component for vehicle rental cards
function VehicleCard({
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  availability,
}: {
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  availability: number
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Rental</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <div>📍 {location}</div>
          <div>{availability} Available Now</div>
        </div>
        <Button className="w-full bg-green-500 hover:bg-green-600">Rent Now</Button>
      </div>
    </div>
  )
}

// Component for testimonial cards
function TestimonialCard({ avatar, name, role, quote }: { avatar: string; name: string; role: string; quote: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <Image src={avatar || "/placeholder.svg"} alt={name} width={40} height={40} className="rounded-full mr-3" />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 italic">"{quote}"</p>
    </div>
  )
}

// Component for rental cards
function RentalCard({
  id,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  availability,
  category,
}: {
  id: number
  image: string
  title: string
  price: number
  unit: string
  rating: number
  reviews: number
  location: string
  availability: number
  category: string
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Rental</div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          {availability} Available
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">{category}</p>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews})</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <div>📍 {location}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
            <Link href={`/rentals/${id}`}>View Details</Link>
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600" asChild>
            <Link href={`/rentals/${id}/request`}>Rent Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
