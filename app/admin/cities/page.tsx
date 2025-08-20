
'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2 } from 'lucide-react';

const citySchema = z.object({ id: z.number().optional(), name_en: z.string().min(2), name_ta: z.string().optional(), state_id: z.coerce.number() });
type CityFormValues = z.infer<typeof citySchema>;
interface State { id: number; name_en: string; }
interface City { id: number; name_en: string; state: State; }

export default function AdminCitiesPage() {
  const { toast } = useToast();
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editing, setEditing] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const { register, handleSubmit, reset, control } = useForm<CityFormValues>({ resolver: zodResolver(citySchema) });

  async function fetchStates() { 
    const res = await fetch('/api/admin/states'); 
    if (res.ok) {
      const { data } = await res.json();
      setStates(data);
    }
  }
  async function fetchCities(page = 1) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/cities?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const { data, pagination } = await res.json();
      setCities(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch cities." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchStates(); fetchCities(currentPage); }, [currentPage]);

  const onSubmit = async (data: CityFormValues) => {
    const url = editing ? `/api/admin/cities/${editing.id}` : '/api/admin/cities';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) {
      toast({ title: `City ${editing ? 'updated' : 'created'}` });
      reset({ name_en: '', name_ta: '', state_id: 0 });
      setEditing(null);
      fetchCities(currentPage);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
    if (res.ok) { toast({ title: "City deleted" }); fetchCities(currentPage); } else { toast({ variant: "destructive", title: "Error", description: "Failed to delete city." }); }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader><CardTitle>{editing ? 'Edit City' : 'Create City'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller name="state_id" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <SelectTrigger><SelectValue placeholder="Select a State" /></SelectTrigger>
                        <SelectContent>{states.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name_en}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
              <Input placeholder="English Name" {...register('name_en')} />
              <Input placeholder="Tamil Name" {...register('name_ta')} />
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              {editing && <Button variant="outline" onClick={() => { setEditing(null); reset(); }}>Cancel</Button>}
            </form>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader><CardTitle>Existing Cities</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : cities.length === 0 ? (
              <p className="text-center text-gray-500">No cities found.</p>
            ) : (
              <ul className="space-y-2">
                {cities.map(city => (
                  <li key={city.id} className="flex justify-between items-center p-2 border rounded">
                    <p>{city.name_en} <span className='text-gray-500'>({city.state.name_en})</span></p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(city); reset({...city, state_id: city.state.id }); }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(city.id)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
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
