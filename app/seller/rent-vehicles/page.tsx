"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  Car,
  Bike,
  MapPin,
  Calendar,
  Clock,
  Users,
  Fuel,
  Settings
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SellerRentVehicles() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/vehicles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your vehicles')
        } else if (response.status === 403) {
          throw new Error('Access denied. Only sellers can view vehicles.')
        } else {
          throw new Error(`Failed to fetch vehicles: ${response.status}`)
        }
      }

      const data = await response.json()
      console.log('Vehicles API response:', data)
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch vehicles')
      // Don't set empty array on error, keep existing vehicles or use mock data
    } finally {
      setLoading(false)
    }
  }

  // Mock data fallback for demo
  const mockVehicles = [
    {
      id: 1,
      name: "Mahindra Bolero Pickup",
      type: "truck",
      category: "Pickup Truck",
      pricePerDay: 1200,
      pricePerHour: 150,
      capacity: "1 Ton",
      fuelType: "Diesel",
      status: "available",
      bookings: 23,
      rating: 4.5,
      image: "/api/placeholder/200/150",
      location: "Chennai, Tamil Nadu",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Tata Ace Mini Truck",
      type: "truck",
      category: "Mini Truck",
      pricePerDay: 800,
      pricePerHour: 100,
      capacity: "750 Kg",
      fuelType: "Diesel",
      status: "rented",
      bookings: 45,
      rating: 4.2,
      image: "/api/placeholder/200/150",
      location: "Chennai, Tamil Nadu",
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      name: "Maruti Suzuki Van",
      type: "van",
      category: "Passenger Van",
      pricePerDay: 1500,
      pricePerHour: 200,
      capacity: "8 Seater",
      fuelType: "Petrol",
      status: "maintenance",
      bookings: 67,
      rating: 4.7,
      image: "/api/placeholder/200/150",
      location: "Chennai, Tamil Nadu",
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      name: "Royal Enfield Classic",
      type: "bike",
      category: "Motorcycle",
      pricePerDay: 400,
      pricePerHour: 50,
      capacity: "2 Seater",
      fuelType: "Petrol",
      status: "available",
      bookings: 12,
      rating: 4.8,
      image: "/api/placeholder/200/150",
      location: "Chennai, Tamil Nadu",
      lastUpdated: "5 hours ago"
    }
  ]

  // Use real vehicles if available, otherwise use mock data
  const displayVehicles = vehicles.length > 0 ? vehicles : mockVehicles

  const filteredVehicles = displayVehicles.filter(vehicle => {
    const matchesSearch = vehicle?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false
    const matchesFilter = filterType === "all" || vehicle?.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800">Rented</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "truck":
        return <Truck className="w-5 h-5" />
      case "car":
        return <Car className="w-5 h-5" />
      case "van":
        return <Car className="w-5 h-5" />
      case "bike":
        return <Bike className="w-5 h-5" />
      default:
        return <Truck className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rent Vehicles</h1>
          <p className="text-gray-600 mt-1">
            Manage your vehicle rental services and bookings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/seller/rent-vehicles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {vehicles.filter(v => v.status === 'available').length}
                </p>
              </div>
              <Car className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Currently Rented</p>
                <p className="text-2xl font-bold text-blue-600">
                  {vehicles.filter(v => v.status === 'rented').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {vehicles.reduce((sum, v) => sum + v.bookings, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "truck" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("truck")}
              >
                Trucks
              </Button>
              <Button
                variant={filterType === "car" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("car")}
              >
                Cars
              </Button>
              <Button
                variant={filterType === "van" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("van")}
              >
                Vans
              </Button>
              <Button
                variant={filterType === "bike" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("bike")}
              >
                Bikes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first vehicle for rent"}
              </p>
              <Link href="/seller/rent-vehicles/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getVehicleIcon(vehicle.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                          <p className="text-sm text-gray-600">{vehicle.category}</p>
                        </div>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>

                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">₹{vehicle.pricePerDay}</p>
                            <p className="text-xs text-gray-500">per day</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">₹{vehicle.pricePerHour}</p>
                            <p className="text-xs text-gray-500">per hour</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">★ {vehicle.rating}</p>
                          <p className="text-xs text-gray-500">{vehicle.bookings} bookings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Fuel className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xs text-gray-500">
                          Updated {vehicle.lastUpdated}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Vehicle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Manage Availability
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Vehicle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
