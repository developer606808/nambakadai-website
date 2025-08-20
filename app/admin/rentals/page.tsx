"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Upload,
  X,
  Car,
  MapPin,
  DollarSign,
  Filter,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImageCropModal } from '@/components/ui/image-crop-modal';

// Define interfaces based on your Prisma schema and API responses
interface RentalProduct {
  id: number;
  name: string;
  description?: string;
  rentalRate: number;
  rentalUnit: string;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
  depositAmount?: number | null;
  images: string[];
  categoryId: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name_en: string; type: string }; // Include category details
  store?: { id: number; name: string; ownerId: number }; // Include store details
}

interface Category {
  id: number;
  name_en: string;
  type: string;
}

interface Store {
  id: number;
  name: string;
  ownerId: number;
}

// Zod schema for form validation
const rentalProductFormSchema = z.object({
  id: z.number().int().optional(), // Optional for create, required for edit
  name: z.string().min(1, { message: "Rental Product Name is required." }),
  description: z.string().optional(),
  rentalRate: z.number().min(0, { message: "Rental Rate must be a non-negative number." }),
  rentalUnit: z.string().min(1, { message: "Rental Unit is required." }),
  availabilityStart: z.string().datetime().optional().nullable(),
  availabilityEnd: z.string().datetime().optional().nullable(),
  depositAmount: z.number().min(0).optional().nullable(),
  categoryId: z.number().int({ message: "Category is required." }),
  storeId: z.number().int({ message: "Store is required." }),
});

type RentalProductFormData = z.infer<typeof rentalProductFormSchema>;

export default function RentalsPage() {
  const [rentals, setRentals] = useState<RentalProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRental, setCurrentRental] = useState<RentalProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Assuming status is derived or added
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page

  // Image states for add/edit dialogs
  const [imageToCropSrc, setImageToCropSrc] = useState<string | null>(null);
  const [isImageCropModalOpen, setIsImageCropModalOpen] = useState(false);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null); // Index of image being edited
  const [rentalImages, setRentalImages] = useState<string[]>([]); // For existing images
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // For new images to upload

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RentalProductFormData>({
    resolver: zodResolver(rentalProductFormSchema),
  });

  // Fetch data on component mount and when page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const rentalsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/rentals?page=${currentPage}&limit=${limit}`);
        if (!rentalsRes.ok) throw new Error(`Failed to fetch rentals: ${rentalsRes.statusText}`);
        const rentalPayload = await rentalsRes.json();
        setRentals(rentalPayload.data);
        setTotalPages(rentalPayload.pagination.totalPages);

        if (categories.length === 0) {
            const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
            if (categoriesRes.ok) setCategories(await categoriesRes.json());
        }
        if (stores.length === 0) {
            const storesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stores`);
            if (storesRes.ok) setStores(await storesRes.json());
        }

      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, categories.length, stores.length]);

  // Filter rentals based on search query and filters
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rental.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      rental.category?.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.store?.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Assuming rental status is derived or a new field
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "available" && rental.availabilityStart && new Date(rental.availabilityStart) <= new Date() && (!rental.availabilityEnd || new Date(rental.availabilityEnd) >= new Date())) ||
                          (statusFilter === "rented" && rental.availabilityEnd && new Date(rental.availabilityEnd) < new Date()); // Simplified logic

    const matchesCategory = categoryFilter === "all" || rental.categoryId === parseInt(categoryFilter);
    const matchesStore = storeFilter === "all" || rental.storeId === parseInt(storeFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesStore;
  });

  const handleAddRental = async (data: RentalProductFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || '');
      formData.append("rentalRate", data.rentalRate.toString());
      formData.append("rentalUnit", data.rentalUnit);
      formData.append("availabilityStart", data.availabilityStart || '');
      formData.append("availabilityEnd", data.availabilityEnd || '');
      formData.append("depositAmount", (data.depositAmount || 0).toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("storeId", data.storeId.toString());

      newImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/rentals`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add rental product');
      }

      const newRental: RentalProduct = await res.json();
      setRentals((prev) => [...prev, newRental]);
      setIsAddDialogOpen(false);
      reset(); // Clear form fields
      setRentalImages([]);
      setNewImageFiles([]);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRental = async (data: RentalProductFormData) => {
    if (!currentRental) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("id", currentRental.id.toString());
      formData.append("name", data.name);
      formData.append("description", data.description || '');
      formData.append("rentalRate", data.rentalRate.toString());
      formData.append("rentalUnit", data.rentalUnit);
      formData.append("availabilityStart", data.availabilityStart || '');
      formData.append("availabilityEnd", data.availabilityEnd || '');
      formData.append("depositAmount", (data.depositAmount || 0).toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("storeId", data.storeId.toString());
      formData.append("existingImageUrls", JSON.stringify(rentalImages)); // Send existing image URLs

      newImageFiles.forEach((file) => {
        formData.append("newImages", file); // Append new image files
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/rentals`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update rental product');
      }

      const updatedRental: RentalProduct = await res.json();
      setRentals((prev) =>
        prev.map((prod) => (prod.id === updatedRental.id ? updatedRental : prod))
      );
      setIsEditDialogOpen(false);
      reset();
      setRentalImages([]);
      setNewImageFiles([]);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRental = async () => {
    if (!currentRental) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/rentals?id=${currentRental.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete rental product');
      }

      setRentals((prev) => prev.filter((prod) => prod.id !== currentRental.id));
      setIsDeleteDialogOpen(false);
      reset();
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection for cropping
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCropSrc(reader.result?.toString() || '');
        setIsImageCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle crop complete from modal
  const handleCropComplete = (blob: Blob) => {
    setCroppedImageBlob(blob);
    // Add the new cropped image to the list of new image files
    setNewImageFiles((prev) => [...prev, new File([blob], `rental_image_${Date.now()}.png`, { type: 'image/png' })]);
    setIsImageCropModalOpen(false);
    setImageToCropSrc(null);
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove: number, isNew: boolean) => {
    if (isNew) {
      setNewImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setRentalImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  // Set form values when editing a rental product
  useEffect(() => {
    if (isEditDialogOpen && currentRental) {
      reset({
        ...currentRental,
        availabilityStart: currentRental.availabilityStart ? new Date(currentRental.availabilityStart).toISOString().slice(0, 16) : '',
        availabilityEnd: currentRental.availabilityEnd ? new Date(currentRental.availabilityEnd).toISOString().slice(0, 16) : '',
      });
      setRentalImages(currentRental.images || []); // Set existing images
      setNewImageFiles([]); // Clear new images when opening edit dialog
    } else if (isAddDialogOpen) {
      reset(); // Clear form fields for add form
      setRentalImages([]);
      setNewImageFiles([]);
    }
  }, [isEditDialogOpen, isAddDialogOpen, currentRental, reset]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Rental Vehicles</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentRental(null); // Clear current rental for add form
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Rental Vehicle
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rentals..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setStoreFilter("all");
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {apiError}</span>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading rental vehicles...
                  </TableCell>
                </TableRow>
              ) : filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No rental vehicles found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>{rental.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={rental.images[0] || "/placeholder.svg"}
                            alt={rental.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{rental.name}</div>
                          <div className="text-xs text-muted-foreground">{rental.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{rental.category?.name_en || '-'}</TableCell>
                    <TableCell>{rental.store?.name || '-'}</TableCell>
                    <TableCell>¥{rental.rentalRate.toFixed(2)}</TableCell>
                    <TableCell>{rental.rentalUnit}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rental.images.map((img, idx) => (
                          <Image key={idx} src={img} alt={`Rental ${idx}`} width={30} height={30} className="rounded-sm object-cover" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentRental(rental);
                              reset({
                                ...rental,
                                availabilityStart: rental.availabilityStart ? new Date(rental.availabilityStart).toISOString().slice(0, 16) : '',
                                availabilityEnd: rental.availabilityEnd ? new Date(rental.availabilityEnd).toISOString().slice(0, 16) : '',
                              });
                              setRentalImages(rental.images || []);
                              setNewImageFiles([]);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentRental(rental);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} disabled={currentPage === 1} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
        </div>
      </div>

      {/* Add Rental Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Rental Vehicle</DialogTitle>
            <DialogDescription>Create a new rental vehicle listing.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-4">
            <form onSubmit={handleSubmit(handleAddRental)} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input id="name" placeholder="Vehicle name" {...register("name")} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentalRate">Rental Rate</Label>
                  <Input id="rentalRate" type="number" step="0.01" placeholder="0.00" {...register("rentalRate", { valueAsNumber: true })} />
                  {errors.rentalRate && <p className="text-red-500 text-sm">{errors.rentalRate.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rentalUnit">Rental Unit</Label>
                <Input id="rentalUnit" placeholder="e.g., per day, per hour" {...register("rentalUnit")} />
                {errors.rentalUnit && <p className="text-red-500 text-sm">{errors.rentalUnit.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Vehicle description" {...register("description")} rows={3} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="availabilityStart">Available From</Label>
                  <Input id="availabilityStart" type="datetime-local" {...register("availabilityStart")} />
                  {errors.availabilityStart && <p className="text-red-500 text-sm">{errors.availabilityStart.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availabilityEnd">Available Until</Label>
                  <Input id="availabilityEnd" type="datetime-local" {...register("availabilityEnd")} />
                  {errors.availabilityEnd && <p className="text-red-500 text-sm">{errors.availabilityEnd.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input id="depositAmount" type="number" step="0.01" placeholder="0.00" {...register("depositAmount", { valueAsNumber: true })} />
                {errors.depositAmount && <p className="text-red-500 text-sm">{errors.depositAmount.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    onValueChange={(value) => setValue("categoryId", parseInt(value))}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeId">Store</Label>
                  <Select
                    onValueChange={(value) => setValue("storeId", parseInt(value))}
                  >
                    <SelectTrigger id="storeId">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.storeId && <p className="text-red-500 text-sm">{errors.storeId.message}</p>}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="grid gap-2">
                <Label>Rental Images</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newImageFiles.map((file, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group">
                      <Image src={URL.createObjectURL(file)} alt={`New Rental ${index}`} fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500">Add Image</span>
                    <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
                  </label>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                  ) : (
                    <><Plus className="mr-2 h-4 w-4" /> Add Rental Vehicle</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Rental Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Rental Vehicle</DialogTitle>
            <DialogDescription>Make changes to the rental vehicle information.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-4">
            <form onSubmit={handleSubmit(handleEditRental)} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Vehicle Name</Label>
                  <Input id="edit-name" placeholder="Vehicle name" {...register("name")} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rentalRate">Rental Rate</Label>
                  <Input id="edit-rentalRate" type="number" step="0.01" placeholder="0.00" {...register("rentalRate", { valueAsNumber: true })} />
                  {errors.rentalRate && <p className="text-red-500 text-sm">{errors.rentalRate.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rentalUnit">Rental Unit</Label>
                <Input id="edit-rentalUnit" placeholder="e.g., per day, per hour" {...register("rentalUnit")} />
                {errors.rentalUnit && <p className="text-red-500 text-sm">{errors.rentalUnit.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" placeholder="Vehicle description" {...register("description")} rows={3} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-availabilityStart">Available From</Label>
                  <Input id="edit-availabilityStart" type="datetime-local" {...register("availabilityStart")} />
                  {errors.availabilityStart && <p className="text-red-500 text-sm">{errors.availabilityStart.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-availabilityEnd">Available Until</Label>
                  <Input id="edit-availabilityEnd" type="datetime-local" {...register("availabilityEnd")} />
                  {errors.availabilityEnd && <p className="text-red-500 text-sm">{errors.availabilityEnd.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-depositAmount">Deposit Amount</Label>
                <Input id="edit-depositAmount" type="number" step="0.01" placeholder="0.00" {...register("depositAmount", { valueAsNumber: true })} />
                {errors.depositAmount && <p className="text-red-500 text-sm">{errors.depositAmount.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-categoryId">Category</Label>
                  <Select
                    defaultValue={currentRental?.categoryId?.toString() || ''}
                    onValueChange={(value) => setValue("categoryId", parseInt(value))}
                  >
                    <SelectTrigger id="edit-categoryId">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-storeId">Store</Label>
                  <Select
                    defaultValue={currentRental?.storeId?.toString() || ''}
                    onValueChange={(value) => setValue("storeId", parseInt(value))}
                  >
                    <SelectTrigger id="edit-storeId">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.storeId && <p className="text-red-500 text-sm">{errors.storeId.message}</p>}
                </div>
              </div>

              {/* Image Upload Section for Edit */}
              <div className="grid gap-2">
                <Label>Rental Images</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {rentalImages.map((imgUrl, index) => (
                    <div key={imgUrl} className="relative w-24 h-24 rounded-md overflow-hidden group">
                      <Image src={imgUrl} alt={`Rental ${index}`} fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {newImageFiles.map((file, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group">
                      <Image src={URL.createObjectURL(file)} alt={`New Rental ${index}`} fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <label
                    htmlFor="edit-image-upload"
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500">Add Image</span>
                    <Input id="edit-image-upload" type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
                  </label>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Rental Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Rental Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rental vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentRental?.images[0] || "/placeholder.svg?height=40&width=40"}
                alt={currentRental?.name || "Rental"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentRental?.name}</p>
              <p className="text-sm text-muted-foreground">
                ¥{currentRental?.rentalRate?.toFixed(2)} per {currentRental?.rentalUnit} • {currentRental?.category?.name_en || '-'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRental} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Rental"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {imageToCropSrc && (
        <ImageCropModal
          isOpen={isImageCropModalOpen}
          onClose={() => setIsImageCropModalOpen(false)}
          imageSrc={imageToCropSrc}
          onCropComplete={(blob) => {
            setCroppedImageBlob(blob);
            // Add the new cropped image to the list of new image files
            setNewImageFiles((prev) => [...prev, new File([blob], `rental_image_${Date.now()}.png`, { type: 'image/png' })]);
            setIsImageCropModalOpen(false);
            setImageToCropSrc(null);
          }}
          aspectRatio={1} // Default aspect ratio for rental images
          circularCrop={false}
        />
      )}
    </div>
  );
}