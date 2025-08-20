'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

const bannerSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  linkUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface Banner extends BannerFormValues {
  id: number;
}

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AdminBannersPage() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
  });

  // const imageUrlWatch = watch("imageUrl");

  // useEffect(() => {
  //   if (imageUrlWatch) {
  //     setImagePreview(imageUrlWatch);
  //   } else {
  //     setImagePreview(null);
  //   }
  // }, [imageUrlWatch]);

  async function fetchBanners(page = 1) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/banners?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch banners");
      const { data, pagination } = await res.json();
      setBanners(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch banners." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchBanners(currentPage); }, [currentPage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setValue("imageUrl", file.name);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setValue("imageUrl", ""); // Clear imageUrl from form state
    // Reset the file input element
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) {
      console.log("No file selected for upload.");
      return null;
    }

    console.log("Attempting to upload file:", selectedFile.name);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      console.log("Upload API response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload API error response:", errorData);
        throw new Error(errorData.error || 'Image upload failed');
      }

      const result = await response.json();
      console.log("Upload API success result:", result);
      toast({ title: "Image uploaded successfully" });
      setSelectedFile(null);
      return result.url; // Assuming the API returns { url: "..." }
    } catch (error: any) {
      console.error("Upload image catch error:", error);
      toast({ variant: "destructive", title: "Upload Error", description: error.message });
      return null;
    }
  };

  const onSubmit = async (data: BannerFormValues) => {
    console.log("onSubmit called with data:", data);
    console.log("onSubmit - editingBanner:", editingBanner);
    setIsSubmitting(true);
    let finalImageUrl = data.imageUrl;

    if (selectedFile) {
      console.log("selectedFile exists, attempting upload...");
      const uploadedUrl = await uploadImage();
      console.log("uploadedUrl after uploadImage:", uploadedUrl);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        console.log("Image upload failed, preventing form submission.");
        // If upload failed, prevent form submission
        setIsSubmitting(false);
        return;
      }
    }

    console.log("finalImageUrl before validation:", finalImageUrl);
    if (!finalImageUrl) {
      toast({ variant: "destructive", title: "Error", description: "Image URL is required." });
      setIsSubmitting(false);
      return;
    }

    const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
    const method = editingBanner ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, imageUrl: finalImageUrl }),
      });

      console.log("Banner API response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Banner API error response:", errorData);
        throw new Error(errorData.error || "Something went wrong.");
      }

      toast({ title: `Banner ${editingBanner ? 'updated' : 'created'}` });
      reset({ title: '', imageUrl: '', linkUrl: '', isActive: true });
      setEditingBanner(null);
      setImagePreview(null);
      fetchBanners(currentPage);
    } catch (error: any) {
      console.error("onSubmit catch error:", error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const response = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete banner.");
      }
      toast({ title: "Banner deleted" });
      fetchBanners(currentPage);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const startEditing = (banner: Banner) => {
    console.log("startEditing called with banner:", banner);
    setEditingBanner(banner);
    reset(banner);
    setValue("imageUrl", banner.imageUrl); // Ensure imageUrl is set in form state for editing
    setImagePreview(banner.imageUrl);
    setSelectedFile(null); // Clear any selected file when starting to edit
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader><CardTitle>{editingBanner ? 'Edit Banner' : 'Create Banner'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Image Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mx-auto h-32 w-32 relative group">
                        <Image src={imagePreview} alt="Image Preview" fill className="rounded-md" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
              </div>

              <Input placeholder="Link URL (Optional)" {...register('linkUrl')} />
              {errors.linkUrl && <p className="text-red-500 text-sm">{errors.linkUrl.message}</p>}

              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={watch('isActive')} onCheckedChange={(checked) => setValue("isActive", checked)} />
                <label htmlFor="isActive">Active</label>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingBanner ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  editingBanner ? 'Update' : 'Create'
                )}
              </Button>
              {editingBanner && <Button type="button" variant="outline" onClick={() => { setEditingBanner(null); reset(); setImagePreview(null); setSelectedFile(null); }}>Cancel</Button>}
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader><CardTitle>Existing Banners</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : banners.length === 0 ? (
              <p className="text-center text-gray-500">No banners found.</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map(banner => (
                      <TableRow key={banner.id}>
                        <TableCell>{banner.id}</TableCell>
                        <TableCell>{banner.title}</TableCell>
                        <TableCell>
                          {banner.imageUrl && (
                            <div className="w-16 h-16 relative">
                              <Image src={banner.imageUrl} alt={banner.title} fill style={{ objectFit: "contain" }} className="rounded-md" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{banner.linkUrl || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => startEditing(banner)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => onDelete(banner.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="flex items-center justify-end pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} /></PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}><PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</PaginationLink></PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
