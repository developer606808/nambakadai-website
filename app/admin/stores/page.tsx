'use client';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2 } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  description: string;
  isApproved: boolean;
  owner: { name: string; email: string; };
}

export default function AdminStoresPage() {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  async function fetchStores(page = 1) {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/admin/stores?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch stores");
        const { data, pagination } = await res.json();
        setStores(data);
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.currentPage);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not fetch stores." });
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => { 
      fetchStores(currentPage); 
    }, [currentPage]);

  const onSetApproval = async (id: number, isApproved: boolean) => {
    const res = await fetch(`/api/admin/stores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved })
    });
    if (res.ok) {
      toast({ title: `Store ${isApproved ? 'approved' : 'rejected'}` });
      fetchStores(currentPage);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Failed to update store status." });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Store Approvals</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <>
                <ul className="space-y-4">
                {stores.map(store => (
                    <li key={store.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 border rounded">
                    <div>
                        <p className="font-semibold text-lg">{store.name}</p>
                        <p className="text-sm">Owner: {store.owner.name} ({store.owner.email})</p>
                        <p className="text-sm text-gray-600 mt-1">{store.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {store.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        <Button size="sm" onClick={() => onSetApproval(store.id, true)} disabled={store.isApproved}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => onSetApproval(store.id, false)} disabled={!store.isApproved}>Reject</Button>
                    </div>
                    </li>
                ))}
                {stores.length === 0 && <p className="text-center py-8">No stores found.</p>}
                </ul>
                <div className="flex items-center justify-between pt-4">
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
            </>
        )}
      </CardContent>
    </Card>
  );
}