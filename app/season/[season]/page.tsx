"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/main-layout"

export default function SeasonCropsPage({ params }: { params: Promise<{ season: string }> }) {
  // Unwrap the params Promise using React.use()
  const { season: seasonParam } = use(params)
  const season = seasonParam.charAt(0).toUpperCase() + seasonParam.slice(1)

  // Mock data for crops
  const crops = [
    {
      id: 1,
      name: "Rice",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 24,
      days: 120,
      tags: ["Organic", "SRI"],
      farmer: "Arun",
    },
    {
      id: 2,
      name: "Groundnut",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 18,
      days: 110,
      tags: ["Organic", "Intercropping"],
      farmer: "Priya",
    },
    {
      id: 3,
      name: "Sesame",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 15,
      days: 90,
      tags: ["Traditional"],
      farmer: "Karthik",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/season" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Season
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{season} - Crops for</h1>
            <p className="text-gray-600">Total Crops: {crops.length}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="relative">
              <Input type="text" placeholder="Search products..." className="pr-10 w-full md:w-[300px]" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-green-500 hover:bg-green-600" asChild>
              <Link href={`/season/${params.season}/add-crop`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <Link href={`/season/${params.season}/${crop.name.toLowerCase()}`} key={crop.id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <div className="h-48 relative">
                  <Image src={crop.image || "/placeholder.svg"} alt={crop.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{crop.name}</h2>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(crop.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({crop.reviews})</span>
                    </div>
                    <span className="ml-auto text-gray-600">{crop.days} days</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {crop.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    by {crop.farmer}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
