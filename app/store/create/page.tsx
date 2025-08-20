'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from "lucide-react"; // spinner icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/main-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch } from "@/lib/hooks";
import { fetchUserData } from "@/lib/features/auth/authSlice";

const storeSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contactName: z.string().min(3, 'Contact name must be at least 3 characters'),
  contactPhone: z.string().min(10, 'Contact phone must be at least 10 characters'),
  // contactEmail: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  stateId: z.string().min(1, 'State is required'),
  cityId: z.string().min(1, 'City is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

// 🔹 Cropper Modal Component
function CropperModal({
  open,
  onClose,
  image,
  crop,
  setCrop,
  onConfirm,
  aspect,
}: {
  open: boolean;
  onClose: () => void;
  image: string | null;
  crop: Crop | undefined;
  setCrop: (c: Crop) => void;
  onConfirm: (croppedUrl: string) => void;
  aspect?: number;
}) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const handleConfirm = () => {
    if (!crop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext("2d");

    ctx?.drawImage(
      imgRef.current,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    const croppedUrl = canvas.toDataURL("image/jpeg");
    onConfirm(croppedUrl);
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>✂️ Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={aspect}>
            <img ref={imgRef} src={image} alt="Crop preview" className="max-h-[400px] object-contain" />
          </ReactCrop>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm}>✅ Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateStorePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });
  const dispatch = useAppDispatch(); // Add this line

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Image states
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [logoCrop, setLogoCrop] = useState<Crop>();
  const [bannerCrop, setBannerCrop] = useState<Crop>();
  const [cropperOpen, setCropperOpen] = useState(false);
  const [activeCropType, setActiveCropType] = useState<'logo' | 'banner' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      const response = await fetch('/api/states');
      const data = await response.json();
      setStates(data);
    };
    fetchStates();
  }, []);

  const handleStateChange = async (stateId: string) => {
    setValue('stateId', stateId);
    const response = await fetch(`/api/cities?stateId=${stateId}`);
    const data = await response.json();
    setCities(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') setLogo(reader.result as string);
        else setBanner(reader.result as string);
        setActiveCropType(type);
        setCropperOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = (imageSrc: string, crop: Crop) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width!;
        canvas.height = crop.height!;
        const ctx = canvas.getContext('2d');

        if (!ctx) return reject("Canvas not supported");

        ctx.drawImage(
          image,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width!,
          crop.height!
        );

        canvas.toBlob(blob => {
          if (!blob) return reject("Crop failed");
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
      };
    });
  };

  const onSubmit = async (data: StoreFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/store/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({ title: "✅ Store Created", description: "Your store has been successfully created." });
        await dispatch(fetchUserData()); // Add this line
        router.push('/store/dashboard');
      } else {
        const errorData = await response.json();
        toast({ variant: "destructive", title: "Error", description: errorData.error || "Failed to create store." });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">✨ Create Your Store</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Store Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Store Name</label>
                      <span className="text-xs text-gray-500">
                        {watch('name')?.length || 0}/50
                      </span>
                    </div>
                    <Input 
                      {...register('name', { maxLength: 50 })} 
                      placeholder="Enter store name" 
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs">{errors.name.message}</p>
                    )}
                  </div>
                </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Description</label>
                  <span className="text-xs text-gray-500">
                    {watch('description')?.length || 0}/200
                  </span>
                </div>
                <Textarea 
                  {...register('description', { maxLength: 200 })} 
                  rows={4} 
                  placeholder="Describe your store..." 
                  maxLength={200}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description.message}</p>
                )}
              </div>

              {/* Contact Info */}
              <h3 className="font-semibold text-lg border-b pb-2">📞 Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input {...register('contactName')} placeholder="John Doe" maxLength={100} />
                  {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    {...register('contactPhone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/, // exactly 10 digits
                        message: 'Enter a valid 10-digit phone number',
                      },
                    })}
                    placeholder=""
                    maxLength={10}
                    inputMode="numeric"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ''); // allow only numbers
                    }}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs">{errors.contactPhone.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register('contactEmail', {
                      // required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // basic email regex
                        message: 'Enter a valid email address',
                      },
                    })}
                    placeholder="example@email.com"
                    maxLength={100}
                    type="email"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <h3 className="font-semibold text-lg border-b pb-2">🏠 Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input {...register('address')} placeholder="123 Main Street"  maxLength={150} />
                  {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Pincode</label>
                    <span className="text-xs text-gray-500">
                      {watch('pincode')?.length || 0}/6
                    </span>
                  </div>
                  <Input
                    {...register('pincode', {
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Enter a valid 6-digit pincode',
                      },
                    })}
                    placeholder="600001"
                    maxLength={6}
                    inputMode="numeric"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ''); // allow only numbers
                    }}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Select onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>{state.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stateId && (
                    <p className="text-red-500 text-xs">{errors.stateId.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Select onValueChange={(val) => setValue('cityId', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>{city.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cityId && (
                    <p className="text-red-500 text-xs">{errors.cityId.message}</p>
                  )}
                </div>
              </div>

              {/* Media Upload */}
              <h3 className="font-semibold text-lg border-b pb-2">🖼️ Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Logo</label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                  {logo && <img src={logo} alt="Logo preview" className="mt-2 h-24 rounded border object-contain" />}
                </div>
                <div>
                  <label className="text-sm font-medium">Banner</label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  {banner && <img src={banner} alt="Banner preview" className="mt-2 h-24 rounded border object-cover w-full" />}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="px-6 py-2 rounded-xl flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>🚀 Create Store</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cropper Modal */}
      <CropperModal
        open={cropperOpen}
        onClose={() => setCropperOpen(false)}
        image={activeCropType === "logo" ? logo : banner}
        crop={activeCropType === "logo" ? logoCrop : bannerCrop}
        setCrop={activeCropType === "logo" ? setLogoCrop : setBannerCrop}
        onConfirm={(croppedUrl) => {
          if (activeCropType === "logo") {
            setLogo(croppedUrl);
          } else {
            setBanner(croppedUrl);
          }
          setCropperOpen(false);
        }}
        aspect={activeCropType === "logo" ? 1 : 16 / 9} // square logo, widescreen banner
      />
    </MainLayout>
  );
}
