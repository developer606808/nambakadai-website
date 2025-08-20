'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Zod schema for the form
const categorySchema = z.object({
  name_en: z.string().min(2, "Name is required"),
  name_ta: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
  icon: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});
type CategoryFormData = z.infer<typeof categorySchema>;

// Interface for category data from the API
interface Category extends CategoryFormData {
  id: number;
}

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const { data, pagination } = await res.json();
      setCategories(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch categories." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleModalOpen = (category: Category | null) => {
    setEditingCategory(category);
    if (category) {
      reset(category);
      setImagePreview(category.image_url || null);
    } else {
      reset({ name_en: '', name_ta: '', slug: '', is_active: true, sort_order: 0, icon: '', image_url: '' });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    let imageUrl = editingCategory?.image_url || null;

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await fetch('/api/upload-image', { method: 'POST', body: formData });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.imageUrl;
      } catch (error: any) {
        toast({ variant: "destructive", title: "Image Upload Failed", description: error.message });
        return;
      }
    }

    const submissionData = { ...data, image_url: imageUrl };
    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submissionData) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }
      toast({ title: "Success", description: `Category ${editingCategory ? 'updated' : 'created'} successfully.` });
      setIsModalOpen(false);
      fetchCategories(currentPage);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => handleModalOpen(null)}><Plus className="mr-2 h-4 w-4"/> Add Category</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name (English)</TableHead>
              <TableHead>Name (Tamil)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
            ) : (
              categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.image_url && <Image src={category.image_url} alt={category.name_en} width={40} height={40} className="h-10 w-10 object-cover rounded-md" />}</TableCell>
                  <TableCell>{category.name_en}</TableCell>
                  <TableCell>{category.name_ta || '-'}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" onClick={() => handleModalOpen(category)}><Edit className="h-4 w-4"/></Button>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en">Name (English)</Label>
                  <Input id="name_en" {...register('name_en')} />
                  {errors.name_en && <p className="text-red-500 text-sm">{errors.name_en.message}</p>}
                </div>
                <div>
                  <Label htmlFor="name_ta">Name (Tamil)</Label>
                  <Input id="name_ta" {...register('name_ta')} />
                </div>
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register('slug')} />
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="icon">Icon (e.g., emoji)</Label>
                    <Input id="icon" {...register('icon')} />
                </div>
                <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input id="sort_order" type="number" {...register('sort_order')} />
                </div>
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }} />
                {imagePreview && <Image src={imagePreview} alt="Category preview" width={80} height={80} className="mt-2 h-20 w-20 object-cover rounded-md"/>}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={watch('is_active')} onCheckedChange={(checked) => setValue("is_active", checked)} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingCategory ? 'Save Changes' : 'Create Category'}</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}