'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Zod schema for the form
const unitSchema = z.object({
  unitName_en: z.string().min(1, "English name is required"),
  abbreviation_en: z.string().min(1, "English abbreviation is required"),
  unitName_ta: z.string().optional(),
  abbreviation_ta: z.string().optional(),
  categoryIds: z.array(z.number().int()).min(1, "At least one category is required"),
  isPublish: z.boolean().default(true),
});
type UnitFormData = z.infer<typeof unitSchema>;

// Interface for unit data from the API
interface Unit extends UnitFormData {
  id: number;
  category_units: { category: { name_en: string } }[];
}

interface Category {
  id: number;
  name_en: string;
}

export default function AdminUnitsClient() {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
  });

  const fetchUnits = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/units?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch units");
      const { data, pagination } = await res.json();
      setUnits(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch units." });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories'); // Assuming this API returns all categories
      if (!res.ok) throw new Error("Failed to fetch categories");
      setCategories(await res.json());
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch categories for selection." });
    }
  };

  useEffect(() => {
    fetchUnits(currentPage);
    fetchCategories();
  }, [currentPage]);

  const handleModalOpen = (unit: Unit | null) => {
    setEditingUnit(unit);
    if (unit) {
      reset({
        ...unit,
        categoryIds: unit.category_units.map(cu => cu.category.id) // Pre-select categories
      });
    } else {
      reset({ unitName_en: '', abbreviation_en: '', unitName_ta: '', abbreviation_ta: '', categoryIds: [], isPublish: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: UnitFormData) => {
    const url = editingUnit ? `/api/admin/units/${editingUnit.id}` : '/api/admin/units';
    const method = editingUnit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save unit");
      }
      toast({ title: "Success", description: `Unit ${editingUnit ? 'updated' : 'created'} successfully.` });
      setIsModalOpen(false);
      fetchUnits(currentPage);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    try {
      const response = await fetch(`/api/admin/units/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete unit");
      }
      toast({ title: "Success", description: "Unit deleted successfully." });
      fetchUnits(currentPage);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: error.message });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Units</h1>
        <Button onClick={() => handleModalOpen(null)}><Plus className="mr-2 h-4 w-4"/> Add Unit</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Abbr. (EN)</TableHead>
              <TableHead>Name (TA)</TableHead>
              <TableHead>Abbr. (TA)</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
            ) : (
              units.map(unit => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell>{unit.unitName_en}</TableCell>
                  <TableCell>{unit.abbreviation_en}</TableCell>
                  <TableCell>{unit.unitName_ta || '-'}</TableCell>
                  <TableCell>{unit.abbreviation_ta || '-'}</TableCell>
                  <TableCell>
                    {unit.category_units.map(cu => cu.category.name_en).join(', ' || '-')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${unit.isPublish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {unit.isPublish ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleModalOpen(unit)}><Edit className="h-4 w-4"/></Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(unit.id)}><Trash2 className="h-4 w-4"/></Button>
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
          <DialogHeader><DialogTitle>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitName_en">Name (English)</Label>
                  <Input id="unitName_en" {...register('unitName_en')} />
                  {errors.unitName_en && <p className="text-red-500 text-sm">{errors.unitName_en.message}</p>}
                </div>
                <div>
                  <Label htmlFor="abbreviation_en">Abbreviation (English)</Label>
                  <Input id="abbreviation_en" {...register('abbreviation_en')} />
                  {errors.abbreviation_en && <p className="text-red-500 text-sm">{errors.abbreviation_en.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitName_ta">Name (Tamil)</Label>
                  <Input id="unitName_ta" {...register('unitName_ta')} />
                </div>
                <div>
                  <Label htmlFor="abbreviation_ta">Abbreviation (Tamil)</Label>
                  <Input id="abbreviation_ta" {...register('abbreviation_ta')} />
                </div>
              </div>
              <div>
                <Label htmlFor="categoryIds">Categories</Label>
                <Controller
                  name="categoryIds"
                  control={control}
                  defaultValue={[]} // Explicitly set default value for Controller
                  render={({ field }) => (
                    <Select
                      multiple // Enable multi-select
                      onValueChange={(selectedValues: string | string[]) => field.onChange((Array.isArray(selectedValues) ? selectedValues : [selectedValues]).map(Number))}
                    >
                      <SelectTrigger id="categoryIds">
                        <SelectValue placeholder="Select categories">
                          {field.value && field.value.length > 0
                            ? field.value.map((id: number) => categories.find(cat => cat.id === id)?.name_en).join(', ')
                            : "Select categories"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryIds && <p className="text-red-500 text-sm">{errors.categoryIds.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isPublish" checked={watch('isPublish')} onCheckedChange={(checked) => setValue("isPublish", checked)} />
                <Label htmlFor="isPublish">Publish</Label>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingUnit ? 'Save Changes' : 'Create Unit'}</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
