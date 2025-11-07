
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ["Electronics", "Furniture", "Clothing", "Books", "Home Decor", "Kitchenware", "Accessories", "Personal Care"];
const conditions = ["New", "Good", "Fair", "Used"];

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  category: z.string({ required_error: "Please select a category." }),
  condition: z.string({ required_error: "Please select a condition." }),
  location: z.string().min(2, 'Location must be at least 2 characters long.'),
  image: z.any().refine(file => !!file, 'Product image is required.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function SellItemPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      location: '',
    },
  });
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/marketplace/sell');
    }
  }, [isUserLoading, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result); // Store data URL
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to list an item.",
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const newProduct = {
            id: Date.now(), // Use timestamp for unique ID in this prototype
            name: values.name,
            price: values.price,
            description: values.description,
            image: values.image, // This is now a data URL
            seller: user?.displayName || "Anonymous",
            sellerId: user.uid, // Add the user's UID
            dataAiHint: values.name.toLowerCase().split(' ').slice(0, 2).join(' '),
            category: values.category,
            condition: values.condition,
            location: values.location,
        };

        const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        localStorage.setItem('userProducts', JSON.stringify([...existingProducts, newProduct]));

        toast({
            title: 'Product Listed!',
            description: `Your item "${values.name}" is now live on the marketplace.`,
        });

        router.push('/marketplace');

    } catch (error) {
        console.error("Failed to save product to localStorage", error);
        toast({
            variant: "destructive",
            title: 'Failed to list item',
            description: 'There was an error saving your product.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <PlusCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-center">List Your Item</CardTitle>
          <CardDescription className="text-center text-lg">
            Give your pre-loved items a new home. Fill out the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Upcycled Denim Jacket" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your item in detail. Mention its condition, materials, etc."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (in ₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bandra West, Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the item's condition" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {conditions.map(con => <SelectItem key={con} value={con}>{con}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
               </div>


              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <Card 
                      className="border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CardContent className="p-4 cursor-pointer">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md flex items-center justify-center bg-muted">
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Product preview" layout="fill" objectFit="contain" />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="mx-auto h-12 w-12" />
                              <p className="mt-2 font-semibold">Click to upload image</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <FormControl>
                       <Input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Listing Item...
                  </>
                ) : (
                  'List Your Item'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
