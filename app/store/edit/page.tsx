
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const storeSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logoUrl: z.string().url('Please enter a valid URL').optional().nullable(),
  bannerUrl: z.string().url('Please enter a valid URL').optional().nullable(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export default function EditStorePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    async function fetchStoreData() {
      const response = await fetch('/api/seller/store');
      if (response.ok) {
        const data = await response.json();
        reset(data); // Pre-fill the form with existing data
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not fetch your store data." });
      }
      setLoading(false);
    }
    fetchStoreData();
  }, [reset, toast]);

  const onSubmit = async (data: StoreFormValues) => {
    const response = await fetch('/api/seller/store', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast({ title: "Success!", description: "Your store has been updated." });
      router.push('/seller/dashboard');
    } else {
      const errorData = await response.json();
      toast({ variant: "destructive", title: "Error", description: errorData.error || "Failed to update store." });
    }
  };

  if (loading) {
    return <p>Loading store details...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Your Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>Store Name</label>
              <Input {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label>Description</label>
              <Textarea {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div>
              <label>Logo URL</label>
              <Input {...register('logoUrl')} placeholder="https://..." />
              {errors.logoUrl && <p className="text-red-500 text-sm">{errors.logoUrl.message}</p>}
            </div>
            <div>
              <label>Banner URL</label>
              <Input {...register('bannerUrl')} placeholder="https://..." />
              {errors.bannerUrl && <p className="text-red-500 text-sm">{errors.bannerUrl.message}</p>}
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
