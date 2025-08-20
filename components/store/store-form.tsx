"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImageCropModal } from '@/components/ui/image-crop-modal';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: "Store Name is required." }),
  description: z.string().optional(),
  prefecture: z.string().min(1, { message: "Prefecture is required." }),
  city: z.string().min(1, { message: "City is required." }),
});

type StoreFormData = z.infer<typeof formSchema>;

interface StoreFormProps {
  initialData?: { // For editing existing stores
    id?: number;
    name: string;
    description?: string;
    prefecture: string;
    city: string;
    logoUrl?: string;
    bannerUrl?: string;
  };
}

export default function StoreForm({ initialData }: StoreFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerUrl || null);

  const [logoFile, setLogoFile] = useState<Blob | null>(null);
  const [bannerFile, setBannerFile] = useState<Blob | null>(null);

  const [isLogoCropModalOpen, setIsLogoCropModalOpen] = useState(false);
  const [isBannerCropModalOpen, setIsBannerCropModalOpen] = useState(false);
  const [imageToCropSrc, setImageToCropSrc] = useState<string | null>(null);
  const [currentCropType, setCurrentCropType] = useState<'logo' | 'banner' | null>(null);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<StoreFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      prefecture: "",
      city: "",
    },
  });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCropSrc(reader.result?.toString() || '');
        setCurrentCropType(type);
        if (type === 'logo') {
          setIsLogoCropModalOpen(true);
        } else {
          setIsBannerCropModalOpen(true);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    if (currentCropType === 'logo') {
      setLogoFile(blob);
      setLogoPreview(URL.createObjectURL(blob));
      setIsLogoCropModalOpen(false);
    } else if (currentCropType === 'banner') {
      setBannerFile(blob);
      setBannerPreview(URL.createObjectURL(blob));
      setIsBannerCropModalOpen(false);
    }
    setImageToCropSrc(null);
    setCurrentCropType(null);
  };

  const onSubmit = async (data: StoreFormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || '');
    formData.append("prefecture", data.prefecture);
    formData.append("city", data.city);

    if (logoFile) {
      formData.append("logo", logoFile, "logo.png");
    }
    if (bannerFile) {
      formData.append("banner", bannerFile, "banner.png");
    }

    const url = initialData?.id ? `/api/store?id=${initialData.id}` : "/api/store";
    const method = initialData?.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: initialData?.id ? "Store updated!" : "Store created!",
          description: result.message,
        });
        router.push("/store/dashboard"); // Redirect to store dashboard
      } else {
        setError("name", { type: "manual", message: result.message }); // Example error handling
        toast({
          title: "Error",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Store form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{initialData?.id ? "Edit Store" : "Create Store"}</h1>
          <p className="text-muted-foreground">{initialData?.id ? "Update your store information here." : "Set up your new store."}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Store Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter store name"
              {...register("name")}
              className="w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefecture" className="text-sm font-medium">
                Prefecture <span className="text-red-500">*</span>
              </Label>
              <Select value={initialData?.prefecture || ""} onValueChange={(value) => register("prefecture").onChange({ target: { value } })}>
                <SelectTrigger id="prefecture" className="w-full">
                  <SelectValue placeholder="Select prefecture" />
                </SelectTrigger>
                <SelectContent>
                  {/* Prefectures list */}
                  <SelectItem value="hokkaido">Hokkaido</SelectItem>
                  <SelectItem value="aomori">Aomori</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  {/* ... other prefectures */}
                </SelectContent>
              </Select>
              {errors.prefecture && <p className="text-red-500 text-sm">{errors.prefecture.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                {...register("city")}
                className="w-full"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Store Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter store description"
              {...register("description")}
              className="w-full"
            />
          </div>

          {/* Store Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Store Logo (1:1 Aspect Ratio)</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Store Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.879-4.879m0 0l4.879 4.879m-4.879-4.879V4m0 12h8m-4-4h.01M12 16h.01"></path></svg>
                )}
              </div>
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Logo
              </label>
              <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={(e) => onSelectFile(e, 'logo')} />
            </div>
          </div>

          {/* Store Banner Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Store Banner (16:9 Aspect Ratio)</Label>
            <div className="flex items-center gap-4">
              <div className="w-48 h-24 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Store Banner Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.879-4.879m0 0l4.879 4.879m-4.879-4.879V4m0 12h8m-4-4h.01M12 16h.01"></path></svg>
                )}
              </div>
              <label
                htmlFor="banner-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Banner
              </label>
              <input type="file" id="banner-upload" className="hidden" accept="image/*" onChange={(e) => onSelectFile(e, 'banner')} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (initialData?.id ? "Updating..." : "Creating...") : (initialData?.id ? "Update Store" : "Create Store")}
            </Button>
          </div>
        </form>
      </div>

      {imageToCropSrc && currentCropType === 'logo' && (
        <ImageCropModal
          isOpen={isLogoCropModalOpen}
          onClose={() => setIsLogoCropModalOpen(false)}
          imageSrc={imageToCropSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // 1:1 aspect ratio for store logo
          circularCrop={true}
        />
      )}

      {imageToCropSrc && currentCropType === 'banner' && (
        <ImageCropModal
          isOpen={isBannerCropModalOpen}
          onClose={() => setIsBannerCropModalOpen(false)}
          imageSrc={imageToCropSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={16 / 9} // 16:9 aspect ratio for store banner
          circularCrop={false}
        />
      )}
    </div>
  );
}
