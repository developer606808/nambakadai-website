"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ListRentalClientPage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [rentalType, setRentalType] = useState("")
  const [prefecture, setPrefecture] = useState("")
  const [city, setCity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Add prefecture and city to the rental data
    const rentalData = {
      title,
      description,
      price,
      type: rentalType,
      prefecture,
      city,
      // other fields...
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Rental listed successfully!",
      description: "Your rental has been listed on the marketplace.",
    })

    setIsSubmitting(false)
    router.push("/rentals")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">List Your Rental</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-sm font-medium">
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="price"
              placeholder="Enter price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="rentalType" className="text-sm font-medium">
              Rental Type <span className="text-red-500">*</span>
            </Label>
            <Select required value={rentalType} onValueChange={setRentalType}>
              <SelectTrigger id="rentalType" className="w-full">
                <SelectValue placeholder="Select rental type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefecture" className="text-sm font-medium">
                Prefecture <span className="text-red-500">*</span>
              </Label>
              <Select required value={prefecture} onValueChange={setPrefecture}>
                <SelectTrigger id="prefecture" className="w-full">
                  <SelectValue placeholder="Select prefecture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hokkaido">Hokkaido</SelectItem>
                  <SelectItem value="aomori">Aomori</SelectItem>
                  <SelectItem value="iwate">Iwate</SelectItem>
                  <SelectItem value="miyagi">Miyagi</SelectItem>
                  <SelectItem value="akita">Akita</SelectItem>
                  <SelectItem value="yamagata">Yamagata</SelectItem>
                  <SelectItem value="fukushima">Fukushima</SelectItem>
                  <SelectItem value="ibaraki">Ibaraki</SelectItem>
                  <SelectItem value="tochigi">Tochigi</SelectItem>
                  <SelectItem value="gunma">Gunma</SelectItem>
                  <SelectItem value="saitama">Saitama</SelectItem>
                  <SelectItem value="chiba">Chiba</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="kanagawa">Kanagawa</SelectItem>
                  <SelectItem value="niigata">Niigata</SelectItem>
                  <SelectItem value="toyama">Toyama</SelectItem>
                  <SelectItem value="ishikawa">Ishikawa</SelectItem>
                  <SelectItem value="fukui">Fukui</SelectItem>
                  <SelectItem value="yamanashi">Yamanashi</SelectItem>
                  <SelectItem value="nagano">Nagano</SelectItem>
                  <SelectItem value="gifu">Gifu</SelectItem>
                  <SelectItem value="shizuoka">Shizuoka</SelectItem>
                  <SelectItem value="aichi">Aichi</SelectItem>
                  <SelectItem value="mie">Mie</SelectItem>
                  <SelectItem value="shiga">Shiga</SelectItem>
                  <SelectItem value="kyoto">Kyoto</SelectItem>
                  <SelectItem value="osaka">Osaka</SelectItem>
                  <SelectItem value="hyogo">Hyogo</SelectItem>
                  <SelectItem value="nara">Nara</SelectItem>
                  <SelectItem value="wakayama">Wakayama</SelectItem>
                  <SelectItem value="tottori">Tottori</SelectItem>
                  <SelectItem value="shimane">Shimane</SelectItem>
                  <SelectItem value="okayama">Okayama</SelectItem>
                  <SelectItem value="hiroshima">Hiroshima</SelectItem>
                  <SelectItem value="yamaguchi">Yamaguchi</SelectItem>
                  <SelectItem value="tokushima">Tokushima</SelectItem>
                  <SelectItem value="kagawa">Kagawa</SelectItem>
                  <SelectItem value="ehime">Ehime</SelectItem>
                  <SelectItem value="kochi">Kochi</SelectItem>
                  <SelectItem value="fukuoka">Fukuoka</SelectItem>
                  <SelectItem value="saga">Saga</SelectItem>
                  <SelectItem value="nagasaki">Nagasaki</SelectItem>
                  <SelectItem value="kumamoto">Kumamoto</SelectItem>
                  <SelectItem value="oita">Oita</SelectItem>
                  <SelectItem value="miyazaki">Miyazaki</SelectItem>
                  <SelectItem value="kagoshima">Kagoshima</SelectItem>
                  <SelectItem value="okinawa">Okinawa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <Button disabled={isSubmitting} className="w-full" type="submit">
            {isSubmitting ? "Submitting..." : "List Rental"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ListRentalClientPage
