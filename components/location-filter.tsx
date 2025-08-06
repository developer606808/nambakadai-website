"use client"

import { useState } from "react"
import { Check, ChevronDown, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Japanese prefectures
const prefectures = [
  "Hokkaido",
  "Aomori",
  "Iwate",
  "Miyagi",
  "Akita",
  "Yamagata",
  "Fukushima",
  "Ibaraki",
  "Tochigi",
  "Gunma",
  "Saitama",
  "Chiba",
  "Tokyo",
  "Kanagawa",
  "Niigata",
  "Toyama",
  "Ishikawa",
  "Fukui",
  "Yamanashi",
  "Nagano",
  "Gifu",
  "Shizuoka",
  "Aichi",
  "Mie",
  "Shiga",
  "Kyoto",
  "Osaka",
  "Hyogo",
  "Nara",
  "Wakayama",
  "Tottori",
  "Shimane",
  "Okayama",
  "Hiroshima",
  "Yamaguchi",
  "Tokushima",
  "Kagawa",
  "Ehime",
  "Kochi",
  "Fukuoka",
  "Saga",
  "Nagasaki",
  "Kumamoto",
  "Oita",
  "Miyazaki",
  "Kagoshima",
  "Okinawa",
]

// Popular cities by prefecture (simplified for demo)
const citiesByPrefecture: Record<string, string[]> = {
  Tokyo: ["Shinjuku", "Shibuya", "Minato", "Setagaya", "Ota", "Edogawa", "Nerima"],
  Osaka: ["Osaka City", "Sakai", "Higashiosaka", "Takatsuki", "Toyonaka", "Suita"],
  Hokkaido: ["Sapporo", "Asahikawa", "Hakodate", "Kushiro", "Obihiro", "Kitami"],
  Kyoto: ["Kyoto City", "Uji", "Kameoka", "Joyo", "Nagaokakyo", "Muko"],
  Fukuoka: ["Fukuoka City", "Kitakyushu", "Kurume", "Omuta", "Iizuka", "Tagawa"],
  // Add more as needed
}

interface LocationFilterProps {
  onFilterChange?: (locations: { prefecture?: string; city?: string }) => void
}

export function LocationFilter({ onFilterChange }: LocationFilterProps) {
  const [openPrefecture, setOpenPrefecture] = useState(false)
  const [openCity, setOpenCity] = useState(false)
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const availableCities = selectedPrefecture ? citiesByPrefecture[selectedPrefecture] || [] : []

  const handlePrefectureSelect = (prefecture: string) => {
    setSelectedPrefecture(prefecture)
    setSelectedCity(null) // Reset city when prefecture changes
    setOpenPrefecture(false)

    if (onFilterChange) {
      onFilterChange({ prefecture, city: undefined })
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setOpenCity(false)

    if (onFilterChange && selectedPrefecture) {
      onFilterChange({ prefecture: selectedPrefecture, city })
    }
  }

  const clearFilters = () => {
    setSelectedPrefecture(null)
    setSelectedCity(null)

    if (onFilterChange) {
      onFilterChange({})
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
        <h3 className="font-medium text-sm">Location</h3>
      </div>

      <div className="space-y-2">
        <Popover open={openPrefecture} onOpenChange={setOpenPrefecture}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openPrefecture} className="w-full justify-between">
              {selectedPrefecture || "Select Prefecture"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search prefecture..." />
              <CommandEmpty>No prefecture found.</CommandEmpty>
              <CommandList className="max-h-60">
                <CommandGroup>
                  {prefectures.map((prefecture) => (
                    <CommandItem
                      key={prefecture}
                      value={prefecture}
                      onSelect={() => handlePrefectureSelect(prefecture)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${selectedPrefecture === prefecture ? "opacity-100" : "opacity-0"}`}
                      />
                      {prefecture}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className="w-full justify-between"
              disabled={!selectedPrefecture}
            >
              {selectedCity || (selectedPrefecture ? "Select City" : "Select Prefecture First")}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandList className="max-h-60">
                <CommandGroup>
                  {availableCities.map((city) => (
                    <CommandItem key={city} value={city} onSelect={() => handleCitySelect(city)}>
                      <Check className={`mr-2 h-4 w-4 ${selectedCity === city ? "opacity-100" : "opacity-0"}`} />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {(selectedPrefecture || selectedCity) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPrefecture && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedPrefecture}
              <button
                onClick={() => {
                  setSelectedPrefecture(null)
                  setSelectedCity(null)
                  if (onFilterChange) onFilterChange({})
                }}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCity && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCity}
              <button
                onClick={() => {
                  setSelectedCity(null)
                  if (onFilterChange && selectedPrefecture) onFilterChange({ prefecture: selectedPrefecture })
                }}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
