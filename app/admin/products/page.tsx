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
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle, Loader2, Plus, Upload, X, Filter } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImageCropModal } from '@/components/ui/image-crop-modal';

// Define interfaces based on your Prisma schema and API responses
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  storeId: number;
  images: string[];
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
const productFormSchema = z.object({
  id: z.number().int().optional(), // Optional for create, required for edit
  name: z.string().min(1, { message: "Product Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  price: z.number().min(0, { message: "Price must be a non-negative number." }),
  categoryId: z.number().int({ message: "Category is required." }),
  storeId: z.number().int({ message: "Store is required." }),
  // images are handled separately via file inputs
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(10); // Products per page

  // Image states for add/edit dialogs
  const [imageToCropSrc, setImageToCropSrc] = useState<string | null>(null);
  const [isImageCropModalOpen, setIsImageCropModalOpen] = useState(false);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null); // Index of image being edited
  const [productImages, setProductImages] = useState<string[]>([]); // For existing images
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // For new images to upload

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
  });

  // Fetch products, categories, and stores on component mount and when page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        // Fetch categories and stores once, but products per page
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products?page=${currentPage}&limit=${limit}`);
        if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
        const productsPayload = await productsRes.json();
        setProducts(productsPayload.data);
        setTotalPages(productsPayload.pagination.totalPages);
        setTotalProducts(productsPayload.pagination.totalProducts);

        // Fetch categories and stores if they haven't been fetched yet
        if (categories.length === 0) {
            const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
            if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);
            setCategories(await categoriesRes.json());
        }
        if (stores.length === 0) {
            const storesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stores`);
            if (!storesRes.ok) throw new Error(`Failed to fetch stores: ${storesRes.statusText}`);
            setStores(await storesRes.json());
        }

      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, limit, categories.length, stores.length]);

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.store?.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Assuming product status is derived from stock or a new field
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && product.price > 0) || // Example: active if price > 0
                          (statusFilter === "inactive" && product.price === 0); // Example: inactive if price is 0

    const matchesCategory = categoryFilter === "all" || product.categoryId === parseInt(categoryFilter);
    const matchesStore = storeFilter === "all" || product.storeId === parseInt(storeFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesStore;
  });

  const handleAddProduct = async (data: ProductFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("storeId", data.storeId.toString());

      newImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const newProduct: Product = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      setIsAddDialogOpen(false);
      reset(); // Clear form fields
      setProductImages([]);
      setNewImageFiles([]);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!currentProduct) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("id", currentProduct.id.toString());
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("storeId", data.storeId.toString());
      formData.append("existingImageUrls", JSON.stringify(productImages)); // Send existing image URLs

      newImageFiles.forEach((file) => {
        formData.append("newImages", file); // Append new image files
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const updatedProduct: Product = await res.json();
      setProducts((prev) =>
        prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
      );
      setIsEditDialogOpen(false);
      reset();
      setProductImages([]);
      setNewImageFiles([]);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products?id=${currentProduct.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((prod) => prod.id !== currentProduct.id));
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
    setNewImageFiles((prev) => [...prev, new File([blob], `product_image_${Date.now()}.png`, { type: 'image/png' })]);
    setIsImageCropModalOpen(false);
    setImageToCropSrc(null);
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove: number, isNew: boolean) => {
    if (isNew) {
      setNewImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setProductImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  // Set form values when editing a product
  useEffect(() => {
    if (isEditDialogOpen && currentProduct) {
      reset(currentProduct);
      setProductImages(currentProduct.images || []); // Set existing images
      setNewImageFiles([]); // Clear new images when opening edit dialog
    } else if (isAddDialogOpen) {
      reset(); // Clear form fields for add form
      setProductImages([]);
      setNewImageFiles([]);
    }
  }, [isEditDialogOpen, isAddDialogOpen, currentProduct, reset]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setCurrentProduct(null); // Clear current product for add form
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name_en || '-'}</TableCell>
                    <TableCell>{product.store?.name || '-'}</TableCell>
                    <TableCell>¥{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.images.map((img, idx) => (
                          <Image key={idx} src={img} alt={`Product image ${idx + 1}`} width={30} height={30} className="rounded-sm object-cover" />
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
                              setCurrentProduct(product);
                              reset(product); // Populate form with current product data
                              setProductImages(product.images || []);
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
                              setCurrentProduct(product);
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

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{totalProducts}</strong> products.
            </div>
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Create a new product listing.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddProduct)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Product name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Product description" {...register("description")} rows={3} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={currentProduct?.categoryId?.toString() || ''}
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
                  value={currentProduct?.storeId?.toString() || ''}
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
              <Label>Product Images</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productImages.map((imgUrl, index) => (
                  <div key={imgUrl} className="relative w-24 h-24 rounded-md overflow-hidden group">
                    <Image src={imgUrl} alt={`Product ${index}`} fill className="object-cover" />
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
                    <Image src={URL.createObjectURL(file)} alt={`New Product ${index}`} fill className="object-cover" />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to the product information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditProduct)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" placeholder="Product name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input id="edit-price" type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" placeholder="Product description" {...register("description")} rows={3} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-categoryId">Category</Label>
                <Select
                  value={currentProduct?.categoryId?.toString() || ''}
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
                  value={currentProduct?.storeId?.toString() || ''}
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
              <Label>Product Images</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productImages.map((imgUrl, index) => (
                  <div key={imgUrl} className="relative w-24 h-24 rounded-md overflow-hidden group">
                    <Image src={imgUrl} alt={`Product ${index}`} fill className="object-cover" />
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
                    <Image src={URL.createObjectURL(file)} alt={`New Product ${index}`} fill className="object-cover" />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={currentProduct?.images[0] || "/placeholder.svg?height=40&width=40"}
                alt={currentProduct?.name || "Product"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentProduct?.name}</p>
              <p className="text-sm text-muted-foreground">
                ¥{currentProduct?.price?.toFixed(2)} • {currentProduct?.category?.name_en || '-'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
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
            setNewImageFiles((prev) => [...prev, new File([blob], `product_image_${Date.now()}.png`, { type: 'image/png' })]);
            setIsImageCropModalOpen(false);
            setImageToCropSrc(null);
          }}
          aspectRatio={1} // Default aspect ratio for product images
          circularCrop={false}
        />
      )}
    </div>
  );
}