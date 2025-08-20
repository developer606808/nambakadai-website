
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({ name: z.string().min(2), image: z.string().url().optional().nullable() });
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile');
      if (res.ok) reset(await res.json());
    }
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) {
      toast({ title: "Profile updated successfully" });
    } else {
      toast({ variant: "destructive", title: "Error updating profile" });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Your Name" {...register('name')} />
            <Input placeholder="Profile Image URL" {...register('image')} />
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
