"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((value) => {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed > 0;
  }, {
    message: "Price must be a valid number greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
    },
  });

  const { pending } = useFormStatus();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast("Product added successfully!");

    setIsSubmitting(false);
    router.push("/store/products");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add prefecture and city to the product data
    const productData = {
      name: form.getValues("name"),
      description: form.getValues("description"),
      price: form.getValues("price"),
      category: form.getValues("category"),
      prefecture,
      city,
      // other fields...
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast("Product added successfully!");
    
    setIsSubmitting(false);
    // Reset form or redirect
  };

  const name = form.getValues("name");
  const description = form.getValues("description");
  const price = form.getValues("price");
  const category = form.getValues("category");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Product price" type="number" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefecture" className="text-sm font-medium">
                Prefecture <span className="text-red-500">*</span>
              </Label>
              <Select required value={prefecture} onValueChange={setPrefecture}>
                <SelectTrigger id="prefecture" className="w-full">
                  <SelectValue placeholder="Select prefecture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hokkaido">Hokkaido</SelectItem>
                  <SelectItem value="aomori">Aomori</SelectItem>
                  <SelectItem value="iwate">Iwate</SelectItem>
                  <SelectItem value="miyagi">Miyagi</SelectItem>
                  <SelectItem value="akita">Akita</SelectItem>
                  <SelectItem value="yamagata">Yamagata</SelectItem>
                  <SelectItem value="fukushima">Fukushima</SelectItem>
                  <SelectItem value="ibaraki">Ibaraki</SelectItem>
                  <SelectItem value="tochigi">Tochigi</SelectItem>
                  <SelectItem value="gunma">Gunma</SelectItem>
                  <SelectItem value="saitama">Saitama</SelectItem>
                  <SelectItem value="chiba">Chiba</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="kanagawa">Kanagawa</SelectItem>
                  <SelectItem value="niigata">Niigata</SelectItem>
                  <SelectItem value="toyama">Toyama</SelectItem>
                  <SelectItem value="ishikawa">Ishikawa</SelectItem>
                  <SelectItem value="fukui">Fukui</SelectItem>
                  <SelectItem value="yamanashi">Yamanashi</SelectItem>
                  <SelectItem value="nagano">Nagano</SelectItem>
                  <SelectItem value="gifu">Gifu</SelectItem>
                  <SelectItem value="shizuoka">Shizuoka</SelectItem>
                  <SelectItem value="aichi">Aichi</SelectItem>
                  <SelectItem value="mie">Mie</SelectItem>
                  <SelectItem value="shiga">Shiga</SelectItem>
                  <SelectItem value="kyoto">Kyoto</SelectItem>
                  <SelectItem value="osaka">Osaka</SelectItem>
                  <SelectItem value="hyogo">Hyogo</SelectItem>
                  <SelectItem value="nara">Nara</SelectItem>
                  <SelectItem value="wakayama">Wakayama</SelectItem>
                  <SelectItem value="tottori">Tottori</SelectItem>
                  <SelectItem value="shimane">Shimane</SelectItem>
                  <SelectItem value="okayama">Okayama</SelectItem>
                  <SelectItem value="hiroshima">Hiroshima</SelectItem>
                  <SelectItem value="yamaguchi">Yamaguchi</SelectItem>
                  <SelectItem value="tokushima">Tokushima</SelectItem>
                  <SelectItem value="kagawa">Kagawa</SelectItem>
                  <SelectItem value="ehime">Ehime</SelectItem>
                  <SelectItem value="kochi">Kochi</SelectItem>
                  <SelectItem value="fukuoka">Fukuoka</SelectItem>
                  <SelectItem value="saga">Saga</SelectItem>
                  <SelectItem value="nagasaki">Nagasaki</SelectItem>
                  <SelectItem value="kumamoto">Kumamoto</SelectItem>
                  <SelectItem value="oita">Oita</SelectItem>
                  <SelectItem value="miyazaki">Miyazaki</SelectItem>
                  <SelectItem value="kagoshima">Kagoshima</SelectItem>
                  <SelectItem value="okinawa">Okinawa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="city" 
                placeholder="Enter city" 
                required 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting || pending}>
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
