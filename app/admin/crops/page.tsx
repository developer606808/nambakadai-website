"use client"

import { useState } from "react"
import { Calendar, Edit, Filter, Loader2, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"

// Form schema for crop
const cropFormSchema = z.object({
  name: z.string().min(2, {
    message: "Crop name must be at least 2 characters.",
  }),
  season: z.string({
    required_error: "Please select a season.",
  }),
  days: z.string().refine((val) => !isNaN(Number.parseInt(val)), {
    message: "Days must be a valid number.",
  }),
  seedQuantity: z.string().min(2, {
    message: "Seed quantity information is required.",
  }),
  fertilizer: z.string().min(10, {
    message: "Fertilizer information must be at least 10 characters.",
  }),
  manpower: z.string().min(10, {
    message: "Manpower information must be at least 10 characters.",
  }),
  techniques: z.string().min(10, {
    message: "Techniques information must be at least 10 characters.",
  }),
})

type CropFormValues = z.infer<typeof cropFormSchema>

// Mock data for crops
const mockCrops = [
  {
    id: "1",
    name: "Rice",
    season: "summer",
    days: 120,
    rating: 4.8,
    reviews: 12,
    farmer: "Arun",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "Wheat",
    season: "winter",
    days: 90,
    rating: 4.5,
    reviews: 8,
    farmer: "Takashi",
    createdAt: "2023-06-20",
  },
  {
    id: "3",
    name: "Corn",
    season: "summer",
    days: 75,
    rating: 4.2,
    reviews: 5,
    farmer: "Hiroshi",
    createdAt: "2023-07-10",
  },
  {
    id: "4",
    name: "Soybean",
    season: "spring",
    days: 100,
    rating: 4.0,
    reviews: 3,
    farmer: "Yuki",
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    name: "Barley",
    season: "winter",
    days: 85,
    rating: 4.3,
    reviews: 7,
    farmer: "Kenji",
    createdAt: "2023-09-12",
  },
]

export default function AdminCropsPage() {
  const [crops, setCrops] = useState(mockCrops)
  const [searchTerm, setSearchTerm] = useState("")
  const [seasonFilter, setSeasonFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCrop, setCurrentCrop] = useState<any>(null)

  // Initialize form
  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: "",
      season: "",
      days: "",
      seedQuantity: "",
      fertilizer: "",
      manpower: "",
      techniques: "",
    },
  })

  // Filter crops based on search term and season filter
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.farmer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeason = seasonFilter ? crop.season === seasonFilter : true
    return matchesSearch && matchesSeason
  })

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSeasonFilter("")
  }

  // Open add dialog
  const openAddDialog = () => {
    form.reset({
      name: "",
      season: "",
      days: "",
      seedQuantity: "",
      fertilizer: "",
      manpower: "",
      techniques: "",
    })
    setIsAddDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (crop: any) => {
    setCurrentCrop(crop)
    form.reset({
      name: crop.name,
      season: crop.season,
      days: crop.days.toString(),
      seedQuantity: "25-30 kg per acre", // Mock data
      fertilizer:
        "Apply farmyard manure @ 12.5 t/ha as basal along with 50 kg of Azospirillum and 50 kg of Phosphobacteria.",
      manpower:
        "Requires significant labor for planting, weeding, and harvesting. Approximately 50-60 person-days per hectare.",
      techniques:
        "System of Rice Intensification (SRI), Direct Seeding, Transplanting, Organic Farming methods can be used.",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (crop: any) => {
    setCurrentCrop(crop)
    setIsDeleteDialogOpen(true)
  }

  // Handle form submission for add/edit
  const onSubmit = async (data: CropFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isEditDialogOpen) {
        // Update crop
        const updatedCrops = crops.map((crop) =>
          crop.id === currentCrop.id
            ? {
                ...crop,
                name: data.name,
                season: data.season,
                days: Number.parseInt(data.days),
              }
            : crop,
        )
        setCrops(updatedCrops)
        toast({
          title: "Crop updated",
          description: "The crop has been updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        // Add new crop
        const newCrop = {
          id: (crops.length + 1).toString(),
          name: data.name,
          season: data.season,
          days: Number.parseInt(data.days),
          rating: 0,
          reviews: 0,
          farmer: "Admin",
          createdAt: new Date().toISOString().split("T")[0],
        }
        setCrops([...crops, newCrop])
        toast({
          title: "Crop added",
          description: "The new crop has been added successfully.",
        })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save crop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedCrops = crops.filter((crop) => crop.id !== currentCrop.id)
      setCrops(updatedCrops)
      toast({
        title: "Crop deleted",
        description: "The crop has been deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get season badge color
  const getSeasonColor = (season: string) => {
    switch (season) {
      case "spring":
        return "bg-green-100 text-green-800"
      case "summer":
        return "bg-yellow-100 text-yellow-800"
      case "autumn":
        return "bg-orange-100 text-orange-800"
      case "winter":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Crops Management</h1>
        <Button onClick={openAddDialog} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Crop
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search crops..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {seasonFilter ? (
                      <span className="capitalize">{seasonFilter} Season</span>
                    ) : (
                      <span>All Seasons</span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || seasonFilter) && (
                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
                  <X className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Growth Days</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSeasonColor(crop.season)}>
                        {crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{crop.days} days</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">{crop.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{crop.reviews}</TableCell>
                    <TableCell>{crop.farmer}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-gray-500" />
                        {crop.createdAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(crop)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(crop)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No crops found. Try adjusting your filters or add a new crop.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Crop Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Edit Crop" : "Add New Crop"}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? "Update the crop information in the form below."
                : "Fill in the details to add a new crop."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter crop name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a season" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="autumn">Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter number of days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seedQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter seed quantity information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fertilizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fertilizer</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter fertilizer information" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manpower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manpower</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter manpower requirements" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="techniques"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Techniques</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter farming techniques" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setIsEditDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditDialogOpen ? "Update Crop" : "Add Crop"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Crop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the crop "{currentCrop?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
