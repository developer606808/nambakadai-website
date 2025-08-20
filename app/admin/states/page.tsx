
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2 } from 'lucide-react';

const stateSchema = z.object({ id: z.number().optional(), name_en: z.string().min(2), name_ta: z.string().optional(), stateCode: z.string().min(2) });
type StateFormValues = z.infer<typeof stateSchema>;
interface State extends StateFormValues { id: number; }

export default function AdminStatesPage() {
  const { toast } = useToast();
  const [states, setStates] = useState<State[]>([]);
  const [editing, setEditing] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const { register, handleSubmit, reset } = useForm<StateFormValues>({ resolver: zodResolver(stateSchema) });

  async function fetchStates(page = 1) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/states?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch states");
      const { data, pagination } = await res.json();
      setStates(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch states." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchStates(currentPage); }, [currentPage]);

  const onSubmit = async (data: StateFormValues) => {
    const url = editing ? `/api/admin/states/${editing.id}` : '/api/admin/states';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) {
      toast({ title: `State ${editing ? 'updated' : 'created'}` });
      reset({ name_en: '', name_ta: '', stateCode: '' });
      setEditing(null);
      fetchStates(currentPage);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/states/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: "State deleted" });
      fetchStates(currentPage);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete state." });
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader><CardTitle>{editing ? 'Edit State' : 'Create State'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="English Name" {...register('name_en')} />
              <Input placeholder="Tamil Name" {...register('name_ta')} />
              <Input placeholder="State Code" {...register('stateCode')} />
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              {editing && <Button variant="outline" onClick={() => { setEditing(null); reset(); }}>Cancel</Button>}
            </form>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader><CardTitle>Existing States</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : states.length === 0 ? (
              <p className="text-center text-gray-500">No states found.</p>
            ) : (
              <ul className="space-y-2">
                {states.map(state => (
                  <li key={state.id} className="flex justify-between items-center p-2 border rounded">
                    <p>{state.name_en} ({state.stateCode})</p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(state); reset(state); }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(state.id)}>Delete</Button>
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
